import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Gender } from 'src/domain/__common__/enums/gender.enum';
import { Job } from 'src/domain/__common__/enums/job.enum';

export class DoUserOnboardingRequest {
  @ApiProperty({ description: '유저 이름' })
  @IsString()
  username: string;

  @ApiProperty({ description: '유저 생일' })
  @IsString()
  birth: string;

  @ApiProperty({ description: '유저 직업', enum: Job, enumName: 'Job' })
  @IsEnum(Job)
  job: Job;

  @ApiProperty({ description: '유저 성별', enum: Gender, enumName: 'Gender' })
  @IsEnum(Gender)
  gender: Gender;
}
