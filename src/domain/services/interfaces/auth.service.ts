import { Injectable } from '@nestjs/common';
import { GoogleAuthOutput } from 'src/domain/dto/auth/google_auth.output';
import { KakaoAuthInput } from 'src/domain/dto/auth/kakao_auth.input';
import { KakaoAuthOutput } from 'src/domain/dto/auth/kakao_auth.output';
import { ReissueAccessTokenInput } from 'src/domain/dto/auth/reissue_accesstoken.input';
import { ReissueAccessTokenOutput } from 'src/domain/dto/auth/reissue_accesstoken.output';
import { GoogleAuthInput } from '../../dto/auth/google_auth.input';
@Injectable()
export abstract class AuthService {
  public abstract signInWithGoogleAccessToken(
    googleAuthInput: GoogleAuthInput,
  ): Promise<GoogleAuthOutput>;

  public abstract signInWithKakaoAccessToken({
    kakaoAccessToken,
  }: KakaoAuthInput): Promise<KakaoAuthOutput>;

  public abstract reissueAccessToken(
    reissueAccessTokenInput: ReissueAccessTokenInput,
  ): Promise<ReissueAccessTokenOutput>;

  public abstract signOut(id: number): Promise<void>;
}
