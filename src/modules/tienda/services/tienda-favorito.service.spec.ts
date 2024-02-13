import { Test, TestingModule } from '@nestjs/testing';
import { TiendaFavoritoService } from './tienda-favorito.service';

describe('TiendaFavoritoService', () => {
  let service: TiendaFavoritoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiendaFavoritoService],
    }).compile();

    service = module.get<TiendaFavoritoService>(TiendaFavoritoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
