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

  address: string; // TODO 나중에 관련 repository dto 수정

  addressDetail: string; // TODO 나중에 관련 repository dto 수정

  shoppingCart: object; //TODO fix it

  orderHistory: object; //TODO fix it

  schedule: object; //TODO fix it
  
}
