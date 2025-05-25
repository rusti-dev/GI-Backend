import { ApiTags } from '@nestjs/swagger';
import { ContractEntity } from '../entities/contract.entity';
import { ContractService } from '../services/contract.service';
import { CreateContractDto, UpdateContractDto } from '../dto/contract.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';



@ApiTags('Contracts')
@Controller('contracts')
export class ContractController {
    constructor(private readonly contractService: ContractService) {}

    @Post()
    create(@Body() createContractDto: CreateContractDto): Promise<ContractEntity> {
        return this.contractService.create(createContractDto);
    }

    @Get()
    findAll(): Promise<ContractEntity[]> {
        return this.contractService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<ContractEntity> {
        return this.contractService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateContractDto: UpdateContractDto,
    ): Promise<ContractEntity> {
        return this.contractService.update(+id, updateContractDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.contractService.remove(+id);
    }
}
