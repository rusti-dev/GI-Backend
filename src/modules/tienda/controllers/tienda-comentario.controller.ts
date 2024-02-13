import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { AuthGuard, RolesGuard } from '../../../modules/auth/guards';
import { QueryDto } from '../../../common/dto/query.dto';
import { ResponseMessage } from '../../../common/interfaces/responseMessage.interface';
import { GetUser } from '../../../modules/auth/decorators';
import { CreateTiendaComentarioDto } from '../dto/';
import { ORDER_ENUM } from '../../../common/constants';
import { TiendaComentarioService } from '../services/tienda-comentario.service';
import { SuspendedGuard } from '../guards/suspended.guard';
import { TiendaSuspended } from '../decorators/tienda.decorator';

@ApiTags('Tienda Comentario')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, SuspendedGuard)
@Controller('tienda-comentario')
export class TiendaComentarioController {
    constructor(private readonly tiendaComentarioService: TiendaComentarioService) { }

    @TiendaSuspended("BODY")
    @Post()
    async create(
        @Body() createTiendaComentarioDto: CreateTiendaComentarioDto,
        @GetUser() usuarioId: string,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 201,
            data: await this.tiendaComentarioService.create(createTiendaComentarioDto, usuarioId)
        };
    }

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
    @ApiQuery({ name: 'attr', type: 'string', required: false })
    @ApiQuery({ name: 'value', type: 'string', required: false })
    @Get("usuario")
    async findAllByUser(
        @Query() queryDto: QueryDto,
        @GetUser() usuarioId: string,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.tiendaComentarioService.findAllByUser(queryDto, usuarioId)
        }
    }

    @TiendaSuspended("PARAMS")
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
    @ApiQuery({ name: 'attr', type: 'string', required: false })
    @ApiQuery({ name: 'value', type: 'string', required: false })
    @ApiParam({ name: 'tiendaId', type: 'string' })
    @Get("tienda/:tiendaId")
    async findAllByTienda(
        @Query() queryDto: QueryDto,
        @Param('tiendaId', ParseUUIDPipe) tiendaId: string,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.tiendaComentarioService.findAllByTienda(queryDto, tiendaId)
        }
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Get('comentario/:id')
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.tiendaComentarioService.findOne(id)
        }
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser() usuarioId: string
    ): Promise<ResponseMessage> {
        return this.tiendaComentarioService.remove(id, usuarioId);
    }
}
