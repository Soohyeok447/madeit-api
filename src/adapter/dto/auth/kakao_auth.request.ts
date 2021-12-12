import { IsString } from 'class-validator';

export class KakaoAuthRequest {
  @IsString()
  kakaoAccessToken: string;
}
