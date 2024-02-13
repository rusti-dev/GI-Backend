import { Test, TestingModule } from '@nestjs/testing';
import { TiendaComentarioService } from './tienda-comentario.service';

describe('TiendaComentarioService', () => {
  let service: TiendaComentarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiendaComentarioService],
    }).compile();

    service = module.get<TiendaComentarioService>(TiendaComentarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
