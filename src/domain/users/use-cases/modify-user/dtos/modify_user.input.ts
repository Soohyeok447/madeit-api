import { Gender } from "src/domain/common/enums/gender.enum";
import { Job } from "src/domain/common/enums/job.enum";
import { S3Object } from "src/domain/common/models/s3object.model";

export class ModifyUserInput {
  id: string; // this is primary key in user table got from user decorator

  profile?;

  username: string;

  birth: string;

  job: Job;

  gender: Gender;
}

