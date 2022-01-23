import { Gender } from 'src/domain/__common__/enums/gender.enum';
import { Job } from 'src/domain/__common__/enums/job.enum';
import { Role } from 'src/domain/__common__/enums/role.enum';

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
}
