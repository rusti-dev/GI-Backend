import { Test, TestingModule } from '@nestjs/testing';
import { TiendaController } from './tienda.controller';
import { TiendaService } from '../services/tienda.service';

describe('TiendaController', () => {
  let controller: TiendaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiendaController],
      providers: [TiendaService],
    }).compile();

    controller = module.get<TiendaController>(TiendaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
