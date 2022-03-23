import { Level } from '../../../common/enums/Level';
import { Role } from '../../../common/enums/Role';
import { Provider } from '../../../use-cases/auth/common/types/provider';

export class UpdateUserDto {
  public userId?: string;

  public email?: string;

  public username?: string;

  public age?: number;

  public goal?: string;

  public statusMessage?: string;

  public refreshToken?: string;

  public provider?: Provider;

  public roles?: Role[];

  public avatar?: string;

  public isAdmin?: boolean;

  public deletedAt?: string;

  public point?: number;

  public exp?: number;

  public didRoutinesInMonth?: number;

  public didRoutinesInTotal?: number;

  public level?: Level;
}
