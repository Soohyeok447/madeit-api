import { ApiProperty } from '@nestjs/swagger';
import { Level } from '../../../../common/enums/Level';

export class SignUpResponseDto {
  @ApiProperty({
    description: '엑세스토큰',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTVlNTI2OWQxNTUyODI5NWFhYTI4NyIsImlhdCI6MTY0NjEzOTgzMiwiZXhwIjoxNjQ2MTQzNDMyLCJpc3MiOiJmdXR1cmVraXRzY2hsYWIifQ.daWuSPH7eCLHh7lI6ML77z2CX7ynM3BFEmwB4SrAyeU',
  })
  public readonly accessToken: string;

  @ApiProperty({
    description: '리프레시토큰',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTVlNTI2OWQxNTUyODI5NWFhYTI4NyIsImlhdCI6MTY0NjEzOTgzMiwiZXhwIjoxNjQ2MTQzNDMyLCJpc3MiOiJmdXR1cmVraXRzY2hsYWIifQ.daWuSPH7eCLHh7lI6ML77z2CX7ynM3BFEmwB4SrAyeU',
  })
  public readonly refreshToken: string;

  @ApiProperty({
    description: '유저 이름',
    example: '삼다삼다수',
  })
  public readonly username: string;

  @ApiProperty({
    description: '유저 나이',
    example: 56,
  })
  public readonly age: number;

  @ApiProperty({
    description: '목표',
    example: '안산시 상록구 갑 국회의원 당선',
  })
  public readonly goal: string;

  @ApiProperty({
    description: '상태메시지',
    example: '바빠서 루틴할 시간이 없어여',
  })
  public readonly statusMessage: string;

  @ApiProperty({
    description: `
    포인트`,
    example: 0,
  })
  public readonly point: number;

  @ApiProperty({
    description: `
    경험치`,
    example: 0,
  })
  public readonly exp: number;

  @ApiProperty({
    description: `
    총 완료 루틴 수`,
    example: 0,
  })
  public readonly didRoutinesInTotal: number;

  @ApiProperty({
    description: `
    이번달 완료 루틴 수`,
    example: 0,
  })
  public readonly didRoutinesInMonth: number;

  @ApiProperty({
    description: `
    레벨`,
    enum: Level,
    example: Level.bronze,
  })
  public readonly level: Level;

  @ApiProperty({
    description: '프로필 이미지 Url',
    example:
      'https://d28okinpr57gbg.cloudfront.net/2fc8d005-6dd4-469c-a2b0-2ea9e2456c20',
  })
  public readonly avatarUrl: string;
}
