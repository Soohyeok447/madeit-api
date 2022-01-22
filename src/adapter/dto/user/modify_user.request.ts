import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Gender } from 'src/domain/common/enums/gender.enum';
import { Job } from 'src/domain/common/enums/job.enum';

export class ModifyUserRequest {
  @ApiProperty({ description: '유저 이름' })
  @IsString()
  username: string;

  @ApiProperty({ description: '유저 생일' })
  @IsString()
  birth: string;

  @ApiProperty({ description: '유저 직업', enum: Job })
  @IsEnum(Job)
  job: Job;

  @ApiProperty({ description: '유저 성별', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({description: '카드뉴스 이미지', type:'string', format:'binary',isArray: true, required: false})
  profileImage: any;
}
