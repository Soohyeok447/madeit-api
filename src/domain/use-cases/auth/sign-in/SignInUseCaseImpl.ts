import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { SignInResponse } from '../response.index';
import { OAuthProviderFactory } from '../../../providers/OAuthProviderFactory';
import { SignInUseCaseParams } from './dtos/SignInUseCaseParams';
import { SignInUseCase } from './SignInUseCase';
import { JwtProvider } from '../../../providers/JwtProvider';
import { User } from '../../../entities/User';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { OAuthProvider, payload } from '../../../providers/OAuthProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class SignInUseCaseImpl implements SignInUseCase {
  public constructor(
    private readonly _oAuthProviderFactory: OAuthProviderFactory,
    private readonly _userRepository: UserRepository,
    private readonly _jwtProvider: JwtProvider,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    thirdPartyAccessToken,
    provider,
  }: SignInUseCaseParams): SignInResponse {
    this._logger.setContext('SignIn');

    const oAuthProvider: OAuthProvider =
      this._oAuthProviderFactory.create(provider);

    const payload: payload = await oAuthProvider.getPayloadByToken(
      thirdPartyAccessToken,
    );

    const userId: string = await oAuthProvider.getUserIdByPayload(payload);

    const user: User = await this._userRepository.findOneByUserId(userId);

    if (!user) {
      throw new UserNotFoundException(
        this._logger.getContext(),
        `미가입 유저가 signin API 호출.`,
      );
    }

    const accessToken: string = this._jwtProvider.signAccessToken(user.id);

    const refreshToken: string = this._jwtProvider.signRefreshToken(user.id);

    await this._userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
