import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/domain/__common__/enums/gender.enum';
import { Job } from 'src/domain/__common__/enums/job.enum';
import { Role } from 'src/domain/__common__/enums/role.enum';

export class FindUserOutput {
  @ApiProperty({ description: '유저 id' })
  id: string;

  @ApiProperty({ description: '유저 이메일' })
  email: string;

  @ApiProperty({ description: '유저 이름' })
  username: string;

  @ApiProperty({ description: '유저 생일' })
  birth: string;

  @ApiProperty({ description: '유저 성별', enum: Gender, enumName: 'Gender' })
  gender: Gender;

  @ApiProperty({ description: '유저 직업', enum: Job, enumName: 'Job' })
  job: Job;

  @ApiProperty({
    description: '유저 Role',
    enum: Role,
    enumName: 'Role',
    isArray: true,
  })
  roles: Role[];

  @ApiProperty({
    description: '프로필 이미지 <br/> 16진법으로 변환 한 buffer입니다. <br/> 16진법에서 buffer로 conversion 필요'
  })
  profileImage: string;
}
