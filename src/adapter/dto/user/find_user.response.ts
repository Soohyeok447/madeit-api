import { Gender } from 'src/domain/models/enum/gender.enum';
import { Job } from 'src/domain/models/enum/job.enum';

export class FindUserResponse {
  email: string;

  username: string;

  provider: string;

  birth: string;

  gender: Gender;

  job: Job;
}
