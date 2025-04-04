import { GENDER } from "src/common/constants/gender";

export interface IUser {
  ci: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender: GENDER;
  address?: string;
  isActive: boolean;
}
