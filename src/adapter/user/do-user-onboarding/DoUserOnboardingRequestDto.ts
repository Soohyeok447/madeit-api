import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Gender } from '../../../domain/enums/Gender';
import { Job } from '../../../domain/enums/Job';

export class DoUserOnboardingRequestDto {
  @ApiProperty({ description: '유저 이름', example: 'test' })
  @IsString()
  username: string;

  @ApiProperty({ description: '유저 생일', example: '1998-11-03' })
  @IsString()
  birth: string;

  @ApiProperty({
    description: '유저 직업',
    enum: Job,
    enumName: 'Job',
    example: 'student',
  })
  @IsEnum(Job)
  job: Job;

  @ApiProperty({
    description: '유저 성별',
    enum: Gender,
    enumName: 'Gender',
    example: 'male',
  })
  @IsEnum(Gender)
  gender: Gender;
}
