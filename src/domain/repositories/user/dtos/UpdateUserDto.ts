import { Gender } from '../../../../domain/enums/Gender';
import { Job } from '../../../../domain/enums/Job';
import { Role } from '../../../../domain/enums/Role';

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
