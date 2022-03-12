import { Level } from '../common/enums/Level';

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

  avatar: string;

  exp: number;

  point: number;

  didRoutinesInTotal: number;

  didRoutinesInMonth: number;

  level: Level;
}
