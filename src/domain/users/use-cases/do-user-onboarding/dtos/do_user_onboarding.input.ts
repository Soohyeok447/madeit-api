import { Gender } from 'src/domain/__common__/enums/gender.enum';
import { Job } from 'src/domain/__common__/enums/job.enum';
import { Role } from 'src/domain/__common__/enums/role.enum';
import { MulterFile } from 'src/domain/__common__/type_alias';

export class DoUserOnboardingInput {
  id: string; // this is primary key in user table got from user decorator

  username: string;

  birth: string;

  job: Job;

  gender: Gender;
}
