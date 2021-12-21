import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class KakaoAuthRequest {
  @ApiProperty({ description: 'kakaoAccessToken' })
  @IsString()
  kakaoAccessToken: string;
}
