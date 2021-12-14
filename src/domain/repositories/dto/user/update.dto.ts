import { BaseEntity } from 'src/infrastructure/entities/base';

export class UpdateUserDto extends BaseEntity {
  public userId?: string;

  public email?: string;

  public username?: string;

  public refreshToken?: string;

  public provider?: string;
}
