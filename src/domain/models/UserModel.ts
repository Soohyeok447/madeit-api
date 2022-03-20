import { Level } from '../common/enums/Level';
import { Provider } from '../use-cases/auth/common/types/provider';

export class UserModel {
  id: string;

  userId: string;

  email: string;

  username: string;

  age: number;

  goal: string;

  statusMessage: string;

  provider: Provider;

  refreshToken?: string;

  isAdmin: boolean;

  avatar: string;

  exp: number;

  point: number;

  didRoutinesInTotal: number;

  didRoutinesInMonth: number;

  level: Level;
}
