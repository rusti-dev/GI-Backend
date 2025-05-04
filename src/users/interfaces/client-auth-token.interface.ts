export interface IClientAuthTokenResult {
    accessToken: string;
    Client: {
      id: string;
      name: string;
      email: string;
      phone?: string;
    };
  }
  