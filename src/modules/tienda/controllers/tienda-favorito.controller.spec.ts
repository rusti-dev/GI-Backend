import { Test, TestingModule } from '@nestjs/testing';
import { TiendaFavoritoController } from './tienda-favorito.controller';

describe('TiendaFavoritoController', () => {
  let controller: TiendaFavoritoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiendaFavoritoController],
    }).compile();

    controller = module.get<TiendaFavoritoController>(TiendaFavoritoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
