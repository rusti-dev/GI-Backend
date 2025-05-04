import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ModalityService } from '../services/modality.service';
import { CreateModalityDto } from '../dto/create-modality.dto';
import { UpdateModalityDto } from '../dto/update-modality.dto';
import { AuthGuard } from '../../users/guards/auth.guard';
import { PermissionGuard } from '../../users/guards/permission.guard';
import { PermissionAccess } from '../../users/decorators/permissions.decorator';
import { PERMISSION } from '../../users/constants/permission.constant';
import { ResponseMessage } from '@/common/interfaces';

@ApiTags('Modalities')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller('modalities')
export class ModalityController {
  constructor(private readonly modalityService: ModalityService) {}

  @PermissionAccess(PERMISSION.MODALITY, PERMISSION.MODALITY_CREATE)
  @Post()
  async create(
    @Body() createModalityDto: CreateModalityDto,
  ): Promise<ResponseMessage> {
    const created = await this.modalityService.create(createModalityDto)
    return {
      statusCode: 201,
      data: created,
    }
  }

  @PermissionAccess(PERMISSION.MODALITY, PERMISSION.MODALITY_SHOW)
  @Get()
  async findAll(): Promise<ResponseMessage> {
    const modalities = await this.modalityService.findAll()
    return {
      statusCode: 200,
      data: modalities,
    }
  }

  @PermissionAccess(PERMISSION.MODALITY, PERMISSION.MODALITY_SHOW)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseMessage> {
    const modality = await this.modalityService.findOne(id)
    return {
      statusCode: 200,
      data: modality,
    }
  }

  @PermissionAccess(PERMISSION.MODALITY, PERMISSION.MODALITY_UPDATE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateModalityDto: UpdateModalityDto,
  ): Promise<ResponseMessage> {
    const updated = await this.modalityService.update(id, updateModalityDto)
    return {
      statusCode: 200,
      data: updated,
    }
  }

  @PermissionAccess(PERMISSION.MODALITY, PERMISSION.MODALITY_DELETE)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseMessage> {
    await this.modalityService.remove(id)
    return {
      statusCode: 200,
      message: 'Modalidad eliminada correctamente',
    }
  }
}
