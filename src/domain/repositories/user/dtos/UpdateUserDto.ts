import { Gender } from 'src/domain/enums/Gender';
import { Job } from 'src/domain/enums/Job';
import { Role } from 'src/domain/enums/Role';

export class UpdateUserDto {
  public id?: number;

  public user_id?: string;

  public email?: string;

  public username?: string;

  public gender?: Gender;

  public job?: Job;

  public birth?: string;

  public refresh_token?: string;

  public provider?: string;

  public roles?: Role[];

  public address?: string;

  public address_detail?: string;

  public profile_id?: string;

  public is_admin?: boolean;
}
