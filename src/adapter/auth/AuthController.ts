import { Body, Headers, Param, Injectable, Query } from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import { SignInRequestDto } from './sign-in/SignInRequestDto';
import { SignInUsecaseParams } from '../../domain/use-cases/auth/sign-in/dtos/SignInUsecaseParams';
import {
  ReissueAccessTokenResponse,
  SignInResonse,
  SignOutResponse,
} from '../../domain/use-cases/auth/response.index';
import { SignOutUseCaseParams } from '../../domain/use-cases/auth/sign-out/dtos/SignOutUseCaseParams';
import { ReissueAccessTokenUsecaseParams } from '../../domain/use-cases/auth/reissue-access-token/dtos/ReissueAccessTokenUsecaseParams';
import { SignInUseCase } from '../../domain/use-cases/auth/sign-in/SignInUseCase';
import { SignOutUseCase } from '../../domain/use-cases/auth/sign-out/SignOutUseCase';
import { ReissueAccessTokenUseCase } from '../../domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCase';

@Injectable()
export class AuthController {
  constructor(
    private readonly _signInUseCase: SignInUseCase,
    private readonly _signOutUseCase: SignOutUseCase,
    private readonly _reissueAccessTokenUseCase: ReissueAccessTokenUseCase,
  ) {}

  async signIn(
    @Body() signInRequest: SignInRequestDto,
    @Query('provider') provider: string,
  ): SignInResonse {
    const input: SignInUsecaseParams = {
      provider,
      ...signInRequest,
    };

    const { accessToken, refreshToken } = await this._signInUseCase.execute(
      input,
    );

    return { accessToken, refreshToken };
  }

  async signOut(@User() user): SignOutResponse {
    const input: SignOutUseCaseParams = {
      userId: user.id,
    };

    await this._signOutUseCase.execute(input);
  }

  async reissueAccessToken(
    @Headers() headers,
    @User() user,
  ): ReissueAccessTokenResponse {
    const refreshToken = headers.authorization.split(' ')[1];

    const input: ReissueAccessTokenUsecaseParams = {
      refreshToken,
      id: user.id,
    };

    const { accessToken } = await this._reissueAccessTokenUseCase.execute(
      input,
    );

    return { accessToken };
  }
}
