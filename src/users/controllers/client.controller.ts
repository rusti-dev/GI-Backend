import { AuthGuard } from "../guards/auth.guard";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateClientDto, UpdateClientDto } from '../dto';
import { ClientService } from '../services/client.service';
import { PermissionGuard } from "../guards/permission.guard";
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards,
} from '@nestjs/common';



@ApiTags('Clients')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post()
    async create(@Body() createClientDto: CreateClientDto) {
        return this.clientService.create(createClientDto);
    }

    @Get()
    async findAll() {
        return this.clientService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.clientService.findOne(id);
    }

    @Patch(':id')
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateClientDto: UpdateClientDto,
    ) {
        return this.clientService.update(id, updateClientDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.clientService.remove(id);
    }
}
