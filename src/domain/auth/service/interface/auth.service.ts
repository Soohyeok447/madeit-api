import { Injectable } from '@nestjs/common';
import { SignInInput } from 'src/domain/auth/use-cases/integrated-sign-in/dtos/signin.input';
import { SignInOutput } from '../../use-cases/integrated-sign-in/dtos/signin.output';
import { ReissueAccessTokenInput } from '../../use-cases/reissue-access-token/dtos/reissue_accesstoken.input';
import { ReissueAccessTokenOutput } from '../../use-cases/reissue-access-token/dtos/reissue_accesstoken.output';

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
