import { ApiProperty } from '@nestjs/swagger';

export class SignInResponse {
  @ApiProperty({ description: 'accessToken' })
  accessToken?: string;

  @ApiProperty({ description: 'refreshToken' })
  refreshToken?: string;
}
