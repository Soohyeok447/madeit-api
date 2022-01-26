import { Gender } from 'src/domain/enums/Gender';
import { Job } from 'src/domain/enums/Job';

export class ModifyUserUsecaseDto {
  id: string; // this is primary key in user table got from user decorator

  profile?;

  username: string;

  birth: string;

  job: Job;

  gender: Gender;
}
