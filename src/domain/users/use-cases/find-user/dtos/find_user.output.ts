import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/domain/common/enums/gender.enum';
import { Job } from 'src/domain/common/enums/job.enum';
import { Role } from 'src/domain/common/enums/role.enum';

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
}
