import { Alarm } from '../alarm/alarm.model';
import { Gender } from '../common/enums/gender.enum';
import { Job } from '../common/enums/job.enum';
import { Role } from '../common/enums/role.enum';

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

  shoppingCart: string[];

  orderHistory: object; //TODO fix it
}
