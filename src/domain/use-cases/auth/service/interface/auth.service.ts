import { Injectable } from '@nestjs/common';
import { SignInResponseDto } from '../../use-cases/integrated-sign-in/dtos/SignInResponseDto';
import { ReissueAccessTokenUsecaseDto } from '../../use-cases/reissue-access-token/dtos/ReissueAccessTokenUsecaseDto';
import { ReissueAccessTokenResponseDto } from '../../use-cases/reissue-access-token/dtos/ReissueAccessTokenResponseDto';
import { SignInUsecaseDto } from '../../use-cases/integrated-sign-in/dtos/SignInUsecaseDto';

@Injectable()
export abstract class AuthService {
  public abstract reissueAccessToken(
    input: ReissueAccessTokenUsecaseDto,
  ): Promise<ReissueAccessTokenResponseDto>;

  public abstract signOut(id: string): Promise<void>;

  public abstract integratedSignIn(
    signInInput: SignInUsecaseDto,
  ): Promise<SignInResponseDto>;
}
