import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { TiendaService } from '../services/tienda.service';
import { CreateTiendaDto, UpdateTiendaDto } from '../dto';
import { AuthGuard, RolesGuard } from '../../auth/guards';
import { ResponseMessage } from '../../../common/interfaces/responseMessage.interface';
import { ORDER_ENUM } from '../../../common/constants';
import { QueryDto } from '../../../common/dto/query.dto';
import { AdminAccess } from '../../auth/decorators';
import { SuspendedGuard } from '../guards/suspended.guard';
import { TiendaSuspended } from '../decorators/tienda.decorator';

@ApiTags('Tienda')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, SuspendedGuard)
@Controller('tienda')
export class TiendaController {

  constructor(private readonly tiendaService: TiendaService) { }

  @AdminAccess()
  @Post()
  async create(@Body() createExampleDto: CreateTiendaDto): Promise<ResponseMessage> {
    return {
      message: 'Tienda created successfully',
      statusCode: 201,
      data: await this.tiendaService.create(createExampleDto)
    };
  }

  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get('all')
  async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.tiendaService.findAll(queryDto)
    };
  }

  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get('publicidad')
  async findPublicidad(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.tiendaService.findPublicidad(queryDto),
    };
  }

  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get('visitas')
  async findPopulares(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.tiendaService.findPopulares(queryDto),
    };
  }

  // @ApiQuery({ name: 'limit', type: 'number', required: false })
  // @ApiQuery({ name: 'offset', type: 'number', required: false })
  // @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  // @ApiQuery({ name: 'attr', type: 'string', required: false })
  // @ApiQuery({ name: 'value', type: 'string', required: false })
  // @Get('recomendadas')
  // async findRecomendados(
  //   @Query() queryDto: QueryDto,
  //   @GetUser() userId: string
  // ): Promise<ResponseMessage> {
  //   return {
  //     statusCode: 200,
  //     data: await this.tiendaService.findRecomendados(queryDto, userId),
  //   };
  // }

  @TiendaSuspended('PARAMS')
  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    return {
      message: 'Tienda found successfully',
      statusCode: 200,
      data: await this.tiendaService.findOne(id),
    };
  }

  @TiendaSuspended('PARAMS')
  @ApiParam({ name: 'id', type: 'string' })
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateExampleDto: UpdateTiendaDto): Promise<ResponseMessage> {
    return {
      message: 'Tienda updated successfully',
      statusCode: 200,
      data: await this.tiendaService.update(id, updateExampleDto),
    };
  }

  @TiendaSuspended('PARAMS')
  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    return this.tiendaService.remove(id);
  }

  @AdminAccess()
  @ApiParam({ name: 'id', type: 'string' })
  @Patch('admin/desusped/:id')
  async desuspend(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    return {
      message: 'Tienda desuspended successfully',
      statusCode: 200,
      data: await this.tiendaService.desuspend(id),
    };
  }

  @AdminAccess()
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get('admin/all')
  async findAllAdmin(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.tiendaService.findAllAndSuspended(queryDto)
    };
  }
}
