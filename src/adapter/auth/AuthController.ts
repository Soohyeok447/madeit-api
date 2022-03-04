import { Body, Headers, Injectable, Query } from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import { SignInRequestDto } from './sign-in/SignInRequestDto';
import { SignInUseCaseParams } from '../../domain/use-cases/auth/sign-in/dtos/SignInUseCaseParams';
import {
  ReissueAccessTokenResponse,
  SignInResponse,
  SignOutResponse,
  SignUpResponse,
  ValidateResponse,
  WithdrawResponse,
} from '../../domain/use-cases/auth/response.index';
import { SignOutUseCaseParams } from '../../domain/use-cases/auth/sign-out/dtos/SignOutUseCaseParams';
import { ReissueAccessTokenUsecaseParams } from '../../domain/use-cases/auth/reissue-access-token/dtos/ReissueAccessTokenUsecaseParams';
import { SignOutUseCase } from '../../domain/use-cases/auth/sign-out/SignOutUseCase';
import { ReissueAccessTokenUseCase } from '../../domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCase';
import { SignInUseCase } from '../../domain/use-cases/auth/sign-in/SignInUseCase';
import { WithDrawUseCaseParams } from '../../domain/use-cases/auth/withdraw/dtos/WithDrawUseCaseParams';
import { WithdrawUseCase } from '../../domain/use-cases/auth/withdraw/WithdrawUseCase';
import { SignUpUseCase } from '../../domain/use-cases/auth/sign-up/SignUpUseCase';
import { ValidateUseCase } from '../../domain/use-cases/auth/validate/ValidateUseCase';
import { SignUpUseCaseParams } from '../../domain/use-cases/auth/sign-up/dtos/SignUpUseCaseParams';
import { SignUpRequestDto } from './sign-up/SignUpRequestDto';
import { Provider } from '../../domain/use-cases/auth/common/types/provider';
import { ValidateRequestDto } from './validate/ValidateRequestDto';
import { ValidateUseCaseParams } from '../../domain/use-cases/auth/validate/dtos/ValidateUseCaseParams';

@Injectable()
export class AuthController {
  constructor(
    private readonly _signUpUseCase: SignUpUseCase,
    private readonly _signInUseCase: SignInUseCase,
    private readonly _validateUseCase: ValidateUseCase,
    private readonly _signOutUseCase: SignOutUseCase,
    private readonly _reissueAccessTokenUseCase: ReissueAccessTokenUseCase,
    private readonly _withdrawUseCase: WithdrawUseCase,
  ) { }

  async validate(
    @Body() validateRequest: ValidateRequestDto,
    @Query('provider') provider: Provider,
  ): ValidateResponse {
    const input: ValidateUseCaseParams = {
      provider,
      ...validateRequest,
    };

    const output = await this._validateUseCase.execute(
      input,
    );

    return output;
  }

  async signUp(
    @Body() signUpRequest: SignUpRequestDto,
    @Query('provider') provider: Provider,
  ): SignUpResponse {
    const input: SignUpUseCaseParams = {
      provider,
      ...signUpRequest,
    };

    const output = await this._signUpUseCase.execute(
      input,
    );

    return output;
  }

  async signIn(
    @Body() signInRequest: SignInRequestDto,
    @Query('provider') provider: Provider,
  ): SignInResponse {
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
