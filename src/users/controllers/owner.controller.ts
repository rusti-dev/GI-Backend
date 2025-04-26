import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PermissionGuard } from "../guards/permission.guard";
import { AuthGuard } from "../guards/auth.guard";
import { OwnerService } from "../services/owner.service";
import { PermissionAccess } from "../decorators/permissions.decorator";
import { PERMISSION } from "../constants/permission.constant";
import { CreateOwnerDto } from "../dto/create-owner.dto";
import { ResponseMessage } from "@/common/interfaces";
import { ORDER_ENUM } from "@/common/constants";
import { QueryDto } from "@/common/dto/query.dto";
import { UpdateOwnerDto } from "../dto/update-owner.dto";

@ApiTags('Owners')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @PermissionAccess(PERMISSION.OWNER, PERMISSION.OWNER_CREATE)
  @Post()
  public async create(@Body() createOwnerDto: CreateOwnerDto): Promise<ResponseMessage> {
    return {
      statusCode: 201,
      data: await this.ownerService.create(createOwnerDto),
    };
  }

  @PermissionAccess(PERMISSION.OWNER, PERMISSION.OWNER_SHOW)
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get()
  public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    const { countData, data } = await this.ownerService.findAll(queryDto);
    return {
      statusCode: 200,
      data,
      countData,
    };
  }

  @PermissionAccess(PERMISSION.OWNER, PERMISSION.OWNER_SHOW)
  @ApiParam({ name: 'ownerId', type: 'string' })
  @Get(':ownerId')
  public async findOne(@Param('ownerId', ParseUUIDPipe) ownerId: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.ownerService.findOne(ownerId),
    };
  }

  @PermissionAccess(PERMISSION.OWNER, PERMISSION.OWNER_UPDATE)
  @ApiParam({ name: 'ownerId', type: 'string' })
  @Post(':ownerId')
  public async update(
    @Param('ownerId', ParseUUIDPipe) ownerId: string,
    @Body() updateOwnerDto: UpdateOwnerDto,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.ownerService.update(ownerId, updateOwnerDto),
    };
  }

  @PermissionAccess(PERMISSION.OWNER, PERMISSION.OWNER_DELETE)
  @ApiParam({ name: 'ownerId', type: 'string' })
  @Delete(':ownerId')
  public async delete(@Param('ownerId', ParseUUIDPipe) ownerId: string): Promise<ResponseMessage> {
    return  await this.ownerService.delete(ownerId)
  }
}