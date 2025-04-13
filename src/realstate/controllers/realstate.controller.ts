import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/interfaces';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { ORDER_ENUM } from 'src/common/constants';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PermissionAccess } from 'src/users/decorators/permissions.decorator';
import { CreateRealState, UpdateRealStateDto } from '../dto';
import { RealStateService } from '../services/realstate.service';

@ApiTags('Realstate')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
@Controller('realstate')
export class UsersController {

  constructor(private readonly realStateService: RealStateService) {}

  @PermissionAccess(PERMISSION.REALSTATE, PERMISSION.REALSTATE_CREATE)
  @Post()
  public async create(
    @Body() createRealStateDto: CreateRealState,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 201,
      data: await this.realStateService.create(createRealStateDto),
    };
  }

  @PermissionAccess(PERMISSION.USER, PERMISSION.USER_SHOW)
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get()
  public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    const { countData, data } = await this.realStateService.findAll(queryDto);
    return {
      statusCode: 200,
      data,
      countData,
    };
  }

  @PermissionAccess(PERMISSION.USER, PERMISSION.USER_SHOW)
  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  public async findOne(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.realStateService.findOne(userId),
    };
  }

  @PermissionAccess(PERMISSION.USER)
  @ApiParam({ name: 'userId', type: 'string' })
  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateRealStateDto,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.realStateService.update(userId, updateUserDto),
    };
  }

  @PermissionAccess(PERMISSION.USER)
  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  public async remove(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<ResponseMessage> {
    return await this.realStateService.delete(userId);
  }
}
