import { ApiProperty } from '@nestjs/swagger';

export class SwaggerConflictUsernameResponseDto {
  @ApiProperty({
    description: 'validation 결과',
    example: false,
  })
  public readonly result: boolean;

  @ApiProperty({
    description: 'validation 결과',
    example: 2,
  })
  public readonly errorCode?: number;

  @ApiProperty({
    description: 'validation 결과',
    example: '중복된 닉네임 입니다',
  })
  public readonly message?: string;
}
