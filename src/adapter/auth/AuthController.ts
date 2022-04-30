import { Body, Headers, Injectable, Query } from '@nestjs/common';
import { UserAuth, UserPayload } from '../common/decorators/user.decorator';
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
import { SignUpResponseDto } from '../../domain/use-cases/auth/sign-up/dtos/SignUpResponseDto';
import { ReissueAccessTokenResponseDto } from '../../domain/use-cases/auth/reissue-access-token/dtos/ReissueAccessTokenResponseDto';

@Injectable()
export class AuthController {
  public constructor(
    private readonly _signUpUseCase: SignUpUseCase,
    private readonly _signInUseCase: SignInUseCase,
    private readonly _validateUseCase: ValidateUseCase,
    private readonly _signOutUseCase: SignOutUseCase,
    private readonly _reissueAccessTokenUseCase: ReissueAccessTokenUseCase,
    private readonly _withdrawUseCase: WithdrawUseCase,
  ) {}

  public async validate(
    @Body() validateRequest: ValidateRequestDto,
    @Query('provider') provider: Provider,
  ): ValidateResponse {
    const input: ValidateUseCaseParams = {
      provider,
      ...validateRequest,
    };

    await this._validateUseCase.execute(input);

    return {};
  }

  public async signUp(
    @Body() signUpRequest: SignUpRequestDto,
    @Query('provider') provider: Provider,
  ): SignUpResponse {
    const input: SignUpUseCaseParams = {
      provider,
      ...signUpRequest,
    };

    const output: SignUpResponseDto = await this._signUpUseCase.execute(input);

    return output;
  }

  public async signIn(
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

  public async signOut(@UserAuth() user: UserPayload): SignOutResponse {
    const input: SignOutUseCaseParams = {
      userId: user.id,
    };

    const response: Record<string, never> = await this._signOutUseCase.execute(
      input,
    );

    return response;
  }

  public async reissueAccessToken(
    @Headers() headers: any,
    @UserAuth() user: UserPayload,
  ): ReissueAccessTokenResponse {
    const refreshToken: string = headers.authorization.split(' ')[1];

    const input: ReissueAccessTokenUsecaseParams = {
      refreshToken,
      id: user.id,
    };

    const response: ReissueAccessTokenResponseDto =
      await this._reissueAccessTokenUseCase.execute(input);

    return response;
  }

  public async withdraw(@UserAuth() user: UserPayload): WithdrawResponse {
    const input: WithDrawUseCaseParams = {
      userId: user.id,
    };

    const response: Record<string, never> = await this._withdrawUseCase.execute(
      input,
    );

    return response;
  }
}
