import { Gender } from "src/domain/models/enum/gender.enum";
import { Job } from "src/domain/models/enum/job.enum";

export class DoUserOnboardingRequest {
  username: string;

  birth: string;

  job: Job;

  gender: Gender;
}
