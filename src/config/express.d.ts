declare namespace Express {
  interface Request {
    userId?: string;
    roleId?: string;
    clientId?: string;
    rawBody?: string;
  }
}