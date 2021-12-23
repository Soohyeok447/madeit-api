import { ApiProperty } from '@nestjs/swagger';

export class KakaoAuthResponse {
  @ApiProperty({ description: 'accessToken' })
  accessToken?: string;

  @ApiProperty({ description: 'refreshToken' })
  refreshToken?: string;
}
