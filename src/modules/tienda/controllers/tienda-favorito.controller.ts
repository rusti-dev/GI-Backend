import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { AuthGuard, RolesGuard } from '../../../modules/auth/guards';
import { QueryDto } from '../../../common/dto/query.dto';
import { ResponseMessage } from '../../../common/interfaces/responseMessage.interface';
import { GetUser } from '../../../modules/auth/decorators';
import { CreateTiendaFavoritoDto } from '../dto/';
import { ORDER_ENUM } from '../../../common/constants';
import { TiendaFavoritoService } from '../services/tienda-favorito.service';
import { SuspendedGuard } from '../guards/suspended.guard';
import { TiendaSuspended } from '../decorators/tienda.decorator';

@ApiTags('Tienda Favorito')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, SuspendedGuard)
@Controller('tienda-favorito')
export class TiendaFavoritoController {
    constructor(private readonly tiendaFavoritoService: TiendaFavoritoService) { }

    @TiendaSuspended("BODY")
    @Post()
    async create(
        @Body() createTiendaFavoritoDto: CreateTiendaFavoritoDto,
        @GetUser() usuarioId: string,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 201,
            data: await this.tiendaFavoritoService.create(createTiendaFavoritoDto.tienda, usuarioId)
        };
    }

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
    @ApiQuery({ name: 'attr', type: 'string', required: false })
    @ApiQuery({ name: 'value', type: 'string', required: false })
    @Get()
    async findAll(
        @Query() queryDto: QueryDto,
        @GetUser() usuarioId: string,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.tiendaFavoritoService.findAll(queryDto, usuarioId)
        }
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Get(':id')
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.tiendaFavoritoService.findOne(id)
        }
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser() usuarioId: string
    ): Promise<ResponseMessage> {
        return this.tiendaFavoritoService.remove(id, usuarioId);
    }
}
