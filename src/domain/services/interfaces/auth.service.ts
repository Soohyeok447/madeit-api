import { Injectable } from '@nestjs/common';
import { GoogleAuthOutput } from 'src/domain/dto/auth/google_auth.output';
import { KakaoAuthInput } from 'src/domain/dto/auth/kakao_auth.input';
import { KakaoAuthOutput } from 'src/domain/dto/auth/kakao_auth.output';
import { ReissueAccessTokenInput } from 'src/domain/dto/auth/reissue_accesstoken.input';
import { ReissueAccessTokenOutput } from 'src/domain/dto/auth/reissue_accesstoken.output';
import { SignInInput } from 'src/domain/dto/auth/signin.input';
import { SignInOutput } from 'src/domain/dto/auth/signin.output';
import { GoogleAuthInput } from '../../dto/auth/google_auth.input';
@Injectable()
export abstract class AuthService {
  public abstract reissueAccessToken(
    reissueAccessTokenInput: ReissueAccessTokenInput,
  ): Promise<ReissueAccessTokenOutput>;

  public abstract signOut(id: string): Promise<void>;

  public abstract test(input: any);

  public abstract integratedSignIn(
    signInInput: SignInInput,
  ): Promise<SignInOutput>;
}
