import * as jwt from 'jsonwebtoken';

import { IUserToken } from '../interfaces/userToken.interface';
import { IAuthTokenResult } from '../interfaces/auth.interface';

export const userToken = (token: string): IUserToken | string => {
  try {
    const decode = jwt.decode(token) as IAuthTokenResult;
    const currentDate = new Date();
    const expiresDate = new Date(decode.exp);
    const isExpired = +expiresDate <= +currentDate / 1000;
    return {
      role: decode.role,
      sub: decode.sub,
      isExpired,
    };
  } catch (error) {
    return 'Token no valido.';
  }
};
