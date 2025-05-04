declare namespace Express {
  interface Request {
    userId: string;
    roleId: string;
    rawBody: string;
    
    // Para clientes
    clientId?: string;
    client?: import('src/users/entities/client.entity').ClientEntity;
  }
}
