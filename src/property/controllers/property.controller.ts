import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { PropertyService } from '../services/property.service';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { ResponseMessage } from 'src/common/interfaces';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { PermissionAccess } from 'src/users/decorators/permissions.decorator';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { ORDER_ENUM } from 'src/common/constants';

@ApiTags('Property')
//@UseGuards(AuthGuard, PermissionGuard)
//@ApiBearerAuth()
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

 // @PermissionAccess(PERMISSION.SECTOR)
  @Post()
  public async create(@Body() createPropertyDto: CreatePropertyDto): Promise<ResponseMessage>{
    return{
      statusCode: 201,
      data: await this.propertyService.create(createPropertyDto),
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
   const { countData, data} = await this.propertyService.findAll(queryDto);
    return {
      statusCode: 200,
      data,
      countData,
    };
  }

  //@PermissionAccess(PERMISSION.SECTOR, PERMISSION.PROPERTY_SHOW)
  @ApiParam({ name: 'propertyId', type: 'string'})
  @Get(':propertyId')
  public async findOne(@Param('propertyId', ParseUUIDPipe) propertyId: string): Promise<ResponseMessage> {
    return {
      statusCode: 200, 
      data: await this.propertyService.findOne(propertyId),
    };
  }

  //@PermissionAccess(PERMISSION.PROPERTY)
  @ApiParam({ name: 'propertyId', type: 'string' })
  @Patch(':propertyId')
  public async update(@Param('propertyId',ParseUUIDPipe) propertyId: string, @Body() updatePropertyDto: UpdatePropertyDto): Promise<ResponseMessage> {
   return{ 
    statusCode: 200, 
    data: await this.propertyService.update(propertyId,updatePropertyDto),
   };
  }

  //@PermissionAccess(PERMISSION.PROPERTY)
  @ApiParam({ name: 'propertyId', type: 'string' })
  @Delete(':propertyId')
  public async delete(@Param('propertyId',ParseUUIDPipe) propertyId: string):Promise<ResponseMessage> {
    return await this.propertyService.delete(propertyId);
  }
}