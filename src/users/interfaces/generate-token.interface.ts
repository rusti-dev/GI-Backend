import * as jwt from 'jsonwebtoken';

export interface IGenerateToken {
  payload: jwt.JwtPayload,
  secret: string,
  expiresIn: number | string;
}