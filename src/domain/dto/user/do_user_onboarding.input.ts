import { Gender } from 'src/domain/models/enum/gender.enum';
import { Job } from 'src/domain/models/enum/job.enum';
import { Role } from 'src/domain/models/enum/role.enum';

export class DoUserOnboardingInput {
  id: number; // this is primary key in user table got from user decorator

  username: string;

  birth: string;

  job: Job;

  roles: Role[];

  gender: Gender;
}
