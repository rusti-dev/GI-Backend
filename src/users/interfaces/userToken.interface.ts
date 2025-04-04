export interface IUserToken {
  role: string;
  sub: string;
  branch?: string;
  isExpired: boolean;
}
