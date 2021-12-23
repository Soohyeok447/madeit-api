import { Gender } from './enum/gender.enum';
import { Job } from './enum/job.enum';
import { Role } from './enum/role.enum';

export class User {
  id: string;

  userId: string;

  email: string;

  username: string;

  provider: string;

  roles: Role[];

  refreshToken?: string;

  isAdmin: boolean;

  birth: string;

  gender: Gender;

  job: Job;
}
