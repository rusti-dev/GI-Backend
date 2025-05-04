import * as jwt from 'jsonwebtoken';
import { IClientToken } from 'src/users/interfaces/client-token.interface';

export function clientToken(token: string): IClientToken | string {
  try {
    const payload = jwt.verify(token, process.env.JWT_AUTH) as any;

    if (payload.type !== 'client') return 'Token inválido para cliente';

    const now = Math.floor(Date.now() / 1000);
    return {
      sub: payload.sub,
      email: payload.email,
      type: payload.type,
      iat: payload.iat,
      exp: payload.exp,
      isExpired: now > payload.exp,
    };
  } catch (error) {
    return 'Token inválido';
  }
}
