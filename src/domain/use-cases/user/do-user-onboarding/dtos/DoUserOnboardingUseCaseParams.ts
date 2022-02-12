import { Gender } from '../../../../../domain/enums/Gender';
import { Job } from '../../../../../domain/enums/Job';

export class DoUserOnboardingUseCaseParams {
  id: string; // this is primary key in user table got from user decorator

  username: string;

  birth: string;

  job: Job;

  gender: Gender;
}
