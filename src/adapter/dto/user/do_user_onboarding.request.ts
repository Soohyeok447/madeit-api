import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { Gender } from 'src/domain/models/enum/gender.enum';
import { Job } from 'src/domain/models/enum/job.enum';
import { Role } from 'src/domain/models/enum/role.enum';

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

  @ApiProperty({ description: '유저 Role', enum: Role, enumName: 'Role', isArray: true })
  @IsArray()
  roles: Role[];
}
