import { Injectable } from '@nestjs/common';
import { ReissueAccessTokenUsecaseDto } from '../../reissue-access-token/dtos/ReissueAccessTokenUsecaseDto';
import { ReissueAccessTokenResponse } from '../../response.index';
import { SignInResponseDto } from '../../sign-in/dtos/SignInResponseDto';
import { SignInUsecaseDto } from '../../sign-in/dtos/SignInUsecaseDto';
import { SignOutUseCaseParams } from '../../sign-out/dtos/SignOutUseCaseParams';

@Injectable()
export abstract class AuthService {
  public abstract reissueAccessToken(
    input: ReissueAccessTokenUsecaseDto,
  ): ReissueAccessTokenResponse;

  public abstract signOut({userId}: SignOutUseCaseParams): Promise<void>;

  public abstract signIn(
    signInInput: SignInUsecaseDto,
  ): Promise<SignInResponseDto>;
}
