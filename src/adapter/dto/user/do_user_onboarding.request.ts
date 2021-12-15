import { IsEnum, IsString } from 'class-validator';
import { Gender } from 'src/domain/models/enum/gender.enum';
import { Job } from 'src/domain/models/enum/job.enum';

export class DoUserOnboardingRequest {
  @IsString()
  username: string;

  @IsString()
  birth: string;

  @IsEnum(Job)
  job: Job;

  @IsEnum(Gender)
  gender: Gender;
}
