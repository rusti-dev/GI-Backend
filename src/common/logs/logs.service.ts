import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  ip: string;
  action: string;
  metadata?: any;
}

interface LogFilter {
  page: number;
  limit: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);
  private readonly logDir = path.join(process.cwd(), 'logs');
  private readonly logFileName = 'application-%DATE%.log';
  private winstonLogger: winston.Logger;

  constructor() {
    // Asegurar que el directorio de logs exista
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    // Configurar Winston
    this.winstonLogger = winston.createLogger({
      transports: [
        new winston.transports.DailyRotateFile({
          filename: path.join(this.logDir, this.logFileName),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
      ],
    });
  }

  /**
   * Registra una acción en la bitácora
   */
  async logAction(entry: Omit<LogEntry, 'id' | 'timestamp'>): Promise<void> {
    try {
      const id = this.generateUUID();
      const timestamp = new Date().toISOString();
      
      this.winstonLogger.info('User Action', {
        id,
        timestamp,
        ...entry,
      });
    } catch (error) {
      this.logger.error(`Error al registrar en la bitácora: ${error.message}`, error.stack);
    }
  }

  /**
   * Obtiene los logs según los filtros especificados
   */
  async getLogs(filter: LogFilter): Promise<{ logs: LogEntry[], totalLogs: number }> {
    try {
      const files = this.getLogFiles();
      let logs: LogEntry[] = [];

      // Leer todos los archivos de log
      for (const file of files) {
        const fileContent = fs.readFileSync(path.join(this.logDir, file), 'utf-8');
        const fileLines = fileContent.split('\n').filter(line => line.trim() !== '');
        
        for (const line of fileLines) {
          try {
            const parsedLine = JSON.parse(line);
            // Verificar si es un registro de acción de usuario
            if (parsedLine.message === 'User Action') {
              const logData = parsedLine;
              
              logs.push({
                id: logData.id || this.generateUUID(),
                timestamp: logData.timestamp,
                user: logData.user || 'desconocido',
                ip: logData.ip || 'desconocida',
                action: logData.action || 'acción no especificada',
                metadata: logData.metadata,
              });
            }
          } catch (e) {
            // Ignorar líneas que no se pueden parsear como JSON
          }
        }
      }

      // Aplicar filtros
      logs = this.applyFilters(logs, filter);

      // Calcular total y aplicar paginación
      const totalLogs = logs.length;
      logs = this.applyPagination(logs, filter.page, filter.limit);

      return {
        logs,
        totalLogs,
      };
    } catch (error) {
      this.logger.error(`Error al obtener logs: ${error.message}`, error.stack);
      return { logs: [], totalLogs: 0 };
    }
  }

  /**
   * Obtiene la lista de archivos de log
   */
  private getLogFiles(): string[] {
    try {
      if (!fs.existsSync(this.logDir)) {
        return [];
      }
      
      return fs.readdirSync(this.logDir)
        .filter(file => file.startsWith('application-') && file.endsWith('.log'));
    } catch (error) {
      this.logger.error(`Error al listar archivos de log: ${error.message}`);
      return [];
    }
  }

  /**
   * Aplica los filtros a la lista de logs
   */
  private applyFilters(logs: LogEntry[], filter: LogFilter): LogEntry[] {
    let filteredLogs = [...logs];

    // Filtrar por búsqueda
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        (log.user && log.user.toLowerCase().includes(searchLower)) ||
        (log.action && log.action.toLowerCase().includes(searchLower)) ||
        (log.ip && log.ip.includes(filter.search))
      );
    }

    // Filtrar por fecha
    if (filter.fromDate) {
      const fromDate = new Date(filter.fromDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= fromDate);
    }

    if (filter.toDate) {
      const toDate = new Date(filter.toDate);
      toDate.setHours(23, 59, 59, 999); // Final del día
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= toDate);
    }

    // Ordenar por fecha descendente (más reciente primero)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return filteredLogs;
  }

  /**
   * Aplica la paginación a la lista de logs
   */
  private applyPagination(logs: LogEntry[], page: number, limit: number): LogEntry[] {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return logs.slice(startIndex, endIndex);
  }

  /**
   * Genera un UUID simple para identificar cada entrada
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
} 