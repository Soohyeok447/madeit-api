import { Gender } from 'src/domain/models/enum/gender.enum';
import { Job } from 'src/domain/models/enum/job.enum';
import { Role } from 'src/domain/models/enum/role.enum';

export class FindUserOutput {
  id: string;

  email: string;

  username: string;

  birth: string;

  gender: Gender;

  job: Job;

  roles: Role[];
}
