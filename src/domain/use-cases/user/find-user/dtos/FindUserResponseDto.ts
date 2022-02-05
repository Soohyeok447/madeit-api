import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/domain/enums/Gender';
import { Job } from 'src/domain/enums/Job';
import { Role } from 'src/domain/enums/Role';

export class FindUserResponseDto {
  @ApiProperty({ description: '유저 이름', example: '테스트' })
  username: string;

  @ApiProperty({ description: '유저 생일', example: '1998-11-03' })
  birth: string;

  @ApiProperty({ description: '유저 성별', enum: Gender, enumName: 'Gender', example: 'female' })
  gender: Gender;

  @ApiProperty({ description: '유저 직업', enum: Job, enumName: 'Job', example: 'student' })
  job: Job;

  @ApiProperty({
    description: '유저 Role',
    enum: Role,
    enumName: 'Role',
    isArray: true,
    example: ['0']
  })
  roles: Role[];

  @ApiProperty({
    description:
      '프로필 이미지',
    example: 'http://d28okinpr57gbg.cloudfront.net/profile/f3a3e741-a0db-41db-8ca3-ebf4e9aa0348'
  })
  avatar: string;
}
