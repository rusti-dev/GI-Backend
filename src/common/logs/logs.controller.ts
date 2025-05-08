import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { LogsService } from './logs.service';
import { AuthGuard } from '../../users/guards/auth.guard';
import { ResponseMessage } from '../interfaces';
import { PermissionAccess } from '../../users/decorators/permissions.decorator';
import { PERMISSION } from '../../users/constants/permission.constant';
import { PermissionGuard } from '../../users/guards/permission.guard';

@ApiTags('Logs')
@Controller('logs')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @Get()
  @PermissionAccess(PERMISSION.LOG_SHOW)
  async getLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ): Promise<ResponseMessage> {
    const { logs, totalLogs } = await this.logsService.getLogs({
      page: +page,
      limit: +limit,
      search,
      fromDate,
      toDate,
    });

    return {
      statusCode: 200,
      data: logs,
      countData: totalLogs,
    };
  }
} 