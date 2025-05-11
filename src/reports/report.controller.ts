import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    // Ruta para generar y enviar reportes por correo
    @Post('generate-and-send')
    @ApiBody({
        description: 'Datos para generar los reportes y correo electrónico de destino',
        type: Object, // Puedes usar Object o definir el tipo de manera más específica si quieres (por ejemplo, CreateReportDto)
    })
    @ApiResponse({
        status: 200,
        description: 'Reportes enviados con éxito',
    })
    @ApiResponse({
        status: 500,
        description: 'Error al generar los reportes',
    })
    async generateAndSendReports(@Body() body: { data: any[], email: string, tableName: string, fileName: string }) {
        const { data, email, tableName, fileName } = body;

        try {
            // Generamos y enviamos los reportes
            await this.reportService.generateAndSendReports(data, email, tableName, fileName);
            return { message: 'Reportes enviados con éxito' };
        } catch (error) {
            console.error('Error al generar o enviar los reportes:', error);
            return { message: 'Hubo un error al generar los reportes', error: error.message };
        }
    }
}
