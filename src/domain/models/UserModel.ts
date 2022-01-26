import { Gender } from '../enums/Gender';
import { Job } from '../enums/Job';
import { Role } from '../enums/Role';

export class UserModel {
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
