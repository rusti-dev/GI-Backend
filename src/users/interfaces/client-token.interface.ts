import { IClientPayload } from './client-payload.interface';

export interface IClientToken extends IClientPayload {
  isExpired: boolean;
}
