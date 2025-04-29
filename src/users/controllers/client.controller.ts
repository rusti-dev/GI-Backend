import { ORDER_ENUM } from "@/common/constants";
import { AuthGuard } from "../guards/auth.guard";
import { ResponseMessage } from "@/common/interfaces";
import { CreateClientDto, UpdateClientDto } from '../dto';
import { ClientService } from '../services/client.service';
import { PermissionGuard } from "../guards/permission.guard";
import { PERMISSION } from "../constants/permission.constant";
import { PermissionAccess } from "../decorators/permissions.decorator";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards,
} from '@nestjs/common';



@ApiTags('Clients')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @PermissionAccess(PERMISSION.CLIENT)
    @Post()
    async create(@Body() createClientDto: CreateClientDto): Promise<ResponseMessage> {
        return {
            statusCode: 201,
            data: await this.clientService.create(createClientDto),
        } 
    }

    @PermissionAccess(PERMISSION.CLIENT, PERMISSION.CLIENT_SHOW)
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
    @ApiQuery({ name: 'attr', type: 'string', required: false })
    @ApiQuery({ name: 'value', type: 'string', required: false })
    @Get()
    async findAll() {
        return this.clientService.findAll();
    }

    @PermissionAccess(PERMISSION.CLIENT, PERMISSION.CLIENT_SHOW)
    @ApiParam({ name: 'id', type: 'string' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.clientService.findOne(id);
    }

    @PermissionAccess(PERMISSION.CLIENT)
    @ApiParam({ name: 'id', type: 'string' })
    @Patch(':id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateClientDto: UpdateClientDto,
    ) {
        return this.clientService.update(id, updateClientDto);
    }

    @PermissionAccess(PERMISSION.CLIENT)
    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.clientService.remove(id);
    }
}
