import { ApiProperty } from '@nestjs/swagger';

export class CountUsersResponseDto {
  @ApiProperty({
    description: `
      회원가입자 수`,
    example: 31,
  })
  public readonly users: number;

  // @ApiProperty({
  //   description: `
  //     활성화 유저 수`,
  //   example: 31,
  // })
  // public readonly activeUsers: number;
}
