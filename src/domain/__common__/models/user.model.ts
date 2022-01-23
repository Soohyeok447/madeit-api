import { Alarm } from './alarm.model';
import { Gender } from '../enums/gender.enum';
import { Job } from '../enums/job.enum';
import { Role } from '../enums/role.enum';
import { MulterFile } from 'src/domain/__common__/type_alias';

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

  address: string;

  addressDetail: string;

  orderHistory: object; //TODO fix it

  profile: string; //TODO buffer라고 수정
}
