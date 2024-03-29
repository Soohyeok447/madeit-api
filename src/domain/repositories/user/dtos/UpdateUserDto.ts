import { Level } from '../../../common/enums/Level';
import { Role } from '../../../common/enums/Role';
import { Provider } from '../../../use-cases/auth/common/types/provider';

export class UpdateUserDto {
  public readonly userId?: string;

  public readonly email?: string;

  public readonly username?: string;

  public readonly age?: number;

  public readonly goal?: string;

  public readonly statusMessage?: string;

  public readonly refreshToken?: string;

  public readonly provider?: Provider;

  public readonly roles?: Role[];

  public readonly avatarId?: string;

  public readonly isAdmin?: boolean;

  public readonly deletedAt?: string;

  public readonly point?: number;

  public readonly exp?: number;

  public readonly level?: Level;
}
