import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UbicacionService } from '../services/ubicacion.service';
import { CreateUbicacionDto } from '../dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from '../dto/update-ubicacion.dto';
import { ResponseMessage } from 'src/common/interfaces';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { PermissionAccess } from 'src/users/decorators/permissions.decorator';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { ORDER_ENUM } from 'src/common/constants';

@ApiTags('Ubicacion')
//@UseGuards(AuthGuard, PermissionGuard)
//@ApiBearerAuth()
@Controller('ubicacion')
export class UbicacionController {
  constructor(private readonly ubicacionService: UbicacionService) {}

 // @PermissionAccess(PERMISSION.SECTOR)
  @Post()
  public async create(@Body() createUbicacionDto: CreateUbicacionDto): Promise<ResponseMessage>{
    return{
      statusCode: 201,
      data: await this.ubicacionService.create(createUbicacionDto),
    };
  }
  //@PermissionAccess(PERMISSION.SECTOR, PERMISSION.PROPERTY_SHOW)
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get()
  public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
   const { countData, data} = await this.ubicacionService.findAll(queryDto);
    return {
      statusCode: 200,
      data,
      countData,
    };
  }

  //@PermissionAccess(PERMISSION.SECTOR, PERMISSION.PROPERTY_SHOW)
  @ApiParam({ name: 'ubicacionId', type: 'string'})
  @Get(':ubicacionId')
  public async findOne(@Param('ubicacionId', ParseUUIDPipe) ubicacionId: string): Promise<ResponseMessage> {
    return {
      statusCode: 200, 
      data: await this.ubicacionService.findOne(ubicacionId),
    };
  }

  //@PermissionAccess(PERMISSION.PROPERTY)
  @ApiParam({ name: 'ubicacionId', type: 'string' })
  @Patch(':ubicacionId')
  public async update(@Param('ubicacionId',ParseUUIDPipe) ubicacionId: string, @Body() updateUbicacionDto: UpdateUbicacionDto): Promise<ResponseMessage> {
   return{ 
    statusCode: 200, 
    data: await this.ubicacionService.update(ubicacionId,updateUbicacionDto),
   };
  }

  //@PermissionAccess(PERMISSION.PROPERTY)
  @ApiParam({ name: 'ubicacionId', type: 'string' })
  @Delete(':ubicacionId')
  public async delete(@Param('ubicacionId',ParseUUIDPipe) ubicacionId: string):Promise<ResponseMessage> {
    return await this.ubicacionService.delete(ubicacionId);
  }
}