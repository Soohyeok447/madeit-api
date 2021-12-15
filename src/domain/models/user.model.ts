import { Gender } from "./enum/gender.enum";
import { Job } from "./enum/job.enum";

export class UserModel {
  id: number;

  userId: string;

  email?: string;

  username?: string;

  provider: string;

  birth?: string;

  gender?: Gender;

  job?: Job;

  refreshToken?: string;
}
