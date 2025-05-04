export interface IClientPayload {
    sub: string;
    email: string;
    type: 'client';
    iat: number;
    exp: number;
  }
  