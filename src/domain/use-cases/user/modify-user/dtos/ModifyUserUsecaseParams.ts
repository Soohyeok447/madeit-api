import { Gender } from 'src/domain/enums/Gender';
import { Job } from 'src/domain/enums/Job';

export class ModifyUserUsecaseParams {
  id: string; // this is primary key in user table got from user decorator

  username: string;

  birth: string;

  job: Job;

  gender: Gender;
}
