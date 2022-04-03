import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({ description: 'accessToken' })
  public readonly accessToken?: string;

  @ApiProperty({ description: 'refreshToken' })
  public readonly refreshToken?: string;
}
