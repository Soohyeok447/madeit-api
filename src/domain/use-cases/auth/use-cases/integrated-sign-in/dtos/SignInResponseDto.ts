import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({ description: 'accessToken' })
  accessToken?: string;

  @ApiProperty({ description: 'refreshToken' })
  refreshToken?: string;
}
