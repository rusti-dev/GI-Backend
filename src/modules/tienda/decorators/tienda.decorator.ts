import { SetMetadata } from '@nestjs/common';
import { TIPO_DATOS_REQ_KEY, TIPO_DATO_REQ } from '../../../common/constants';

export const TiendaSuspended = (...request: Array<keyof typeof TIPO_DATO_REQ>) => SetMetadata(TIPO_DATOS_REQ_KEY, request);
