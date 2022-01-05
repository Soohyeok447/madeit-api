import { Gender } from 'src/domain/common/enums/gender.enum';
import { Job } from 'src/domain/common/enums/job.enum';
import { Role } from 'src/domain/common/enums/role.enum';

export class FindUserOutput {
  id: string;

  email: string;

  username: string;

  birth: string;

  gender: Gender;

  job: Job;

  roles: Role[];
}
