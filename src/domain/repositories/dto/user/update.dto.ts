import { Gender } from 'src/domain/models/enum/gender.enum';
import { Job } from 'src/domain/models/enum/job.enum';
import { BaseEntity } from 'src/infrastructure/entities/base';

export class UpdateUserDto extends BaseEntity {
  public user_id?: string;

  public email?: string;

  public username?: string;

  public gender?: Gender;

  public job?: Job;

  public birth?: string;

  public refresh_token?: string;

  public provider?: string;
}
