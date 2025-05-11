import { Module, Global } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { ReportService } from '@/reports/report.service';

@Global()
@Module({
  providers: [LogsService, ReportService],
  controllers: [LogsController],
  exports: [LogsService]
})
export class LogsModule {} 