import { ApiProperty } from '@nestjs/swagger';
import { Level } from '../../../../common/enums/Level';

export class FindUserResponseDto {
  @ApiProperty({ description: '유저 이름', example: '테스트' })
  username: string;

  @ApiProperty({
    description: '유저 나이',
    example: 33,
  })
  age: number;

  @ApiProperty({
    description: '목표',
    example: '다리찢기 1자',
  })
  goal: string;

  @ApiProperty({
    description: '상태 메시지',
    example: 'im so high',
  })
  statusMessage: string;

  @ApiProperty({
    description: '프로필 이미지',
    example:
      'http://d28okinpr57gbg.cloudfront.net/profile/f3a3e741-a0db-41db-8ca3-ebf4e9aa0348',
  })
  avatar: string;

  @ApiProperty({
    description: `
    포인트`,
    example: 350,
  })
  point: number;

  @ApiProperty({
    description: `
    경험치`,
    example: 3000,
  })
  exp: number;

  @ApiProperty({
    description: `
    총 완료 루틴 수`,
    example: 32,
  })
  didRoutinesInTotal: number;

  @ApiProperty({
    description: `
    이번달 완료 루틴 수`,
    example: 13,
  })
  didRoutinesInMonth: number;

  @ApiProperty({
    description: `
    레벨`,
    enum: Level,
    example: Level.grandMaster,
  })
  level: Level;
}
