import { Gender } from "src/domain/__common__/enums/gender.enum";
import { Job } from "src/domain/__common__/enums/job.enum";
import { S3Object } from "src/domain/__common__/models/s3object.model";

export class ModifyUserInput {
  id: string; // this is primary key in user table got from user decorator

  profile?;

  username: string;

  birth: string;

  job: Job;

  gender: Gender;
}

