import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { SignInResponse } from '../response.index';
import { OAuthProviderFactory } from '../../../providers/OAuthProviderFactory';
import { SignInUseCaseParams } from './dtos/SignInUseCaseParams';
import { SignInUseCase } from './SignInUseCase';
import { JwtProvider } from '../../../providers/JwtProvider';
import { User } from '../../../entities/User';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';

@Injectable()
export class SignInUseCaseImpl implements SignInUseCase {
  constructor(
    private readonly _oAuthProviderFactory: OAuthProviderFactory,
    private readonly _userRepository: UserRepository,
    private readonly _jwtProvider: JwtProvider,
  ) {}

  public async execute({
    thirdPartyAccessToken,
    provider,
  }: SignInUseCaseParams): SignInResponse {
    const oAuthProvider = this._oAuthProviderFactory.create(provider);

    const payload = await oAuthProvider.verifyToken(thirdPartyAccessToken);

    const userId: string = await oAuthProvider.getUserIdByPayload(payload);

    const user: User = await this._userRepository.findOneByUserId(userId);

    if (!user) throw new UserNotFoundException();

    const accessToken = this._jwtProvider.signAccessToken(user.id);

    const refreshToken = this._jwtProvider.signRefreshToken(user.id);

    await this._userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
