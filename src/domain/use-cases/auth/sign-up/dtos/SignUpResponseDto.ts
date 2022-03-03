import { ApiProperty } from "@nestjs/swagger";

export class SignUpResponseDto {
  @ApiProperty({
    description: '유저 이름',
    example: '삼다삼다수',
  })
  username: string;

  @ApiProperty({
    description: '유저 나이',
    example: 33,
  })
  age: number;

  @ApiProperty({
    description: '목표',
    example: '나는 해적왕이 될거야! ONEPIECE 매일 한 권씩 읽기',
  })
  goal: string;

  @ApiProperty({
    description: '상태메시지',
    example: '나는 야인이 되겠어',
  })
  statusMessage: string;

  @ApiProperty({
    description: '엑세스토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTVlNTI2OWQxNTUyODI5NWFhYTI4NyIsImlhdCI6MTY0NjEzOTgzMiwiZXhwIjoxNjQ2MTQzNDMyLCJpc3MiOiJmdXR1cmVraXRzY2hsYWIifQ.daWuSPH7eCLHh7lI6ML77z2CX7ynM3BFEmwB4SrAyeU',
  })
  accessToken: string;

  @ApiProperty({
    description: '리프레시토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTVlNTI2OWQxNTUyODI5NWFhYTI4NyIsImlhdCI6MTY0NjEzOTgzMiwiZXhwIjoxNjQ2MTQzNDMyLCJpc3MiOiJmdXR1cmVraXRzY2hsYWIifQ.daWuSPH7eCLHh7lI6ML77z2CX7ynM3BFEmwB4SrAyeU',
  })
  refreshToken: string;
}