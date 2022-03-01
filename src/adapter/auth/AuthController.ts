import { Body, Headers, Injectable, Query } from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import { SignInRequestDto } from './sign-in/SignInRequestDto';
import { SignInUseCaseParams } from '../../domain/use-cases/auth/sign-in/dtos/SignInUseCaseParams';
import {
  ReissueAccessTokenResponse,
  SignInResonse,
  SignOutResponse,
  WithdrawResponse,
} from '../../domain/use-cases/auth/response.index';
import { SignOutUseCaseParams } from '../../domain/use-cases/auth/sign-out/dtos/SignOutUseCaseParams';
import { ReissueAccessTokenUsecaseParams } from '../../domain/use-cases/auth/reissue-access-token/dtos/ReissueAccessTokenUsecaseParams';
import { SignOutUseCase } from '../../domain/use-cases/auth/sign-out/SignOutUseCase';
import { ReissueAccessTokenUseCase } from '../../domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCase';
import { SignInUseCase } from '../../domain/use-cases/auth/sign-in/SignInUseCase';
import { WithDrawUseCaseParams } from '../../domain/use-cases/auth/withdraw/dtos/WithDrawUseCaseParams';
import { WithdrawUseCase } from '../../domain/use-cases/auth/withdraw/WithdrawUseCase';

@Injectable()
export class AuthController {
  constructor(
    private readonly _signInUseCase: SignInUseCase,
    private readonly _signOutUseCase: SignOutUseCase,
    private readonly _reissueAccessTokenUseCase: ReissueAccessTokenUseCase,
    private readonly _withdrawUseCase: WithdrawUseCase,
  ) {}

  async signIn(
    @Body() signInRequest: SignInRequestDto,
    @Query('provider') provider: string,
  ): SignInResonse {
    const input: SignInUseCaseParams = {
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

    const response = await this._signOutUseCase.execute(input);

    return response;
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

  async withdraw(@User() user): WithdrawResponse {
    const input: WithDrawUseCaseParams = {
      userId: user.id,
    };

    const response = await this._withdrawUseCase.execute(input);

    return response;
  }
}
