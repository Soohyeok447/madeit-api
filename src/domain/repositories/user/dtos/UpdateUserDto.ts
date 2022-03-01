import { Role } from '../../../../domain/enums/Role';

export class UpdateUserDto {
  public id?: number;

  public user_id?: string;

  public email?: string;

  public username?: string;

  public age?: number;

  public goal?: string;

  public status_message?: string;

  public refresh_token?: string;

  public provider?: string;

  public roles?: Role[];

  public avatar_id?: string;

  public is_admin?: boolean;

  public deleted_at?: string;
}
