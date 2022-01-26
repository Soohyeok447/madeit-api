import { Role } from 'src/domain/enums/Role';

export class CreateUserDto {
  public user_id: string;

  public email: string;

  public provider: string;

  public roles: Role;

  public is_admin: boolean;
}