import { Test, TestingModule } from '@nestjs/testing';
import { TiendaComentarioController } from './tienda-comentario.controller';

describe('TiendaComentarioController', () => {
  let controller: TiendaComentarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiendaComentarioController],
    }).compile();

    controller = module.get<TiendaComentarioController>(TiendaComentarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
