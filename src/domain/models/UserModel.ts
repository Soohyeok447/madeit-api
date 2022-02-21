import { Role } from '../enums/Role';

export class UserModel {
  id: string;

  userId: string;

  email: string;

  username: string;

  age: number;

  goal: string;

  statusMessage: string;

  provider: string;

  refreshToken?: string;

  isAdmin: boolean;

  profile: string;
}
