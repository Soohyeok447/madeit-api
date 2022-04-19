import { ApiProperty } from '@nestjs/swagger';

export class SwaggerInvalidUsernameResponseDto {
  @ApiProperty({
    description: 'validation 결과',
    example: false,
  })
  public readonly result: boolean;

  @ApiProperty({
    description: 'validation 결과',
    example: 1,
  })
  public readonly errorCode?: number;

  @ApiProperty({
    description: 'validation 결과',
    example: '닉네임은 2자 이상 8자 이하여야 합니다',
  })
  public readonly message?: string;
}
