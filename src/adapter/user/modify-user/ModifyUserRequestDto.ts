import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from 'src/domain/enums/Gender';
import { Job } from 'src/domain/enums/Job';

export class ModifyUserRequestDto {
  @ApiProperty({
    description: '유저 이름',
    required: false,
  })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({
    description: '유저 생일',
    required: false,
  })
  @IsOptional()
  @IsString()
  birth: string;

  @ApiProperty({
    description: '유저 직업',
    enum: Job,
    required: false,
  })
  @IsOptional()
  @IsEnum(Job)
  job: Job;

  @ApiProperty({
    description: '유저 성별',
    enum: Gender,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
}
