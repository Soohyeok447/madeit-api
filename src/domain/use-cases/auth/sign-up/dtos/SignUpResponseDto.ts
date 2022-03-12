import { ApiProperty } from '@nestjs/swagger';
import { Level } from '../../../../common/enums/Level';

export class SignUpResponseDto {
  @ApiProperty({
    description: '유저 이름',
    example: '삼다삼다수',
  })
  username: string;

  @ApiProperty({
    description: '유저 나이',
    example: 56,
  })
  age: number;

  @ApiProperty({
    description: '목표',
    example: '안산시 상록구 갑 국회의원 당선',
  })
  goal: string;

  @ApiProperty({
    description: '상태메시지',
    example: '바빠서 루틴할 시간이 없어여',
  })
  statusMessage: string;

  @ApiProperty({
    description: '엑세스토큰',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTVlNTI2OWQxNTUyODI5NWFhYTI4NyIsImlhdCI6MTY0NjEzOTgzMiwiZXhwIjoxNjQ2MTQzNDMyLCJpc3MiOiJmdXR1cmVraXRzY2hsYWIifQ.daWuSPH7eCLHh7lI6ML77z2CX7ynM3BFEmwB4SrAyeU',
  })
  accessToken: string;

  @ApiProperty({
    description: '리프레시토큰',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTVlNTI2OWQxNTUyODI5NWFhYTI4NyIsImlhdCI6MTY0NjEzOTgzMiwiZXhwIjoxNjQ2MTQzNDMyLCJpc3MiOiJmdXR1cmVraXRzY2hsYWIifQ.daWuSPH7eCLHh7lI6ML77z2CX7ynM3BFEmwB4SrAyeU',
  })
  refreshToken: string;

  @ApiProperty({
    description: `
    포인트`,
    example: 0,
  })
  point: number;

  @ApiProperty({
    description: `
    경험치`,
    example: 0,
  })
  exp: number;

  @ApiProperty({
    description: `
    총 완료 루틴 수`,
    example: 0,
  })
  didRoutinesInTotal: number;

  @ApiProperty({
    description: `
    이번달 완료 루틴 수`,
    example: 0,
  })
  didRoutinesInMonth: number;

  @ApiProperty({
    description: `
    레벨`,
    enum: Level,
    example: Level.bronze,
  })
  level: Level;
}
