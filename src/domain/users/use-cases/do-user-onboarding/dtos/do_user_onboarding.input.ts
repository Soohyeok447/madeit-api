import { Gender } from 'src/domain/common/enums/gender.enum';
import { Job } from 'src/domain/common/enums/job.enum';
import { Role } from 'src/domain/common/enums/role.enum';
import { MulterFile } from 'src/domain/types';

export class DoUserOnboardingInput {
  id: string; // this is primary key in user table got from user decorator

  username: string;

  birth: string;

  job: Job;

  gender: Gender;
}
