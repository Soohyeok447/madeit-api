import { BaseEntity } from 'src/infrastructure/entities/base';

export class UpdateUserDto extends BaseEntity {
  public user_id?: string;

  public email?: string;

  public username?: string;

  public gender?: string;

  public birth?: string;

  public job?: string;

  public refresh_token?: string;

  public provider?: string;
}
