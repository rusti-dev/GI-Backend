export interface IAuth {
  email: string;
  password: string;
}

export interface IAuthTokenResult {
  role: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface ISendEmail {
  email: string;
}

export interface IResetPassword {
  token: string;
  password: string;
}
