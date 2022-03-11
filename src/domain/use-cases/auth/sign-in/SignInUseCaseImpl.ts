import { Injectable } from '@nestjs/common';
import { UserModel } from '../../../../domain/models/UserModel';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { SignInResponse } from '../response.index';
import { OAuth, payload } from '../common/oauth-abstract-factory/OAuth';
import { OAuthFactory } from '../common/oauth-abstract-factory/OAuthFactory';
import { SignInResponseDto } from './dtos/SignInResponseDto';
import { SignInUseCaseParams } from './dtos/SignInUseCaseParams';
import { SignInUseCase } from './SignInUseCase';
import { JwtProvider } from '../../../providers/JwtProvider';
import { CommonUserService } from '../../user/common/CommonUserService';

@Injectable()
export class SignInUseCaseImpl implements SignInUseCase {
  constructor(
    private readonly _oAuthFactory: OAuthFactory,
    private readonly _userRepository: UserRepository,
    private readonly _jwtProvider: JwtProvider,
  ) {}

  public async execute({
    thirdPartyAccessToken,
    provider,
  }: SignInUseCaseParams): SignInResponse {
    const oAuth: OAuth = this._oAuthFactory.createOAuth(
      thirdPartyAccessToken,
      provider,
    );

    const payload: payload = await oAuth.verifyToken();

    const userId: string = await oAuth.getUserIdByPayload(payload);

    const user: UserModel = await this._userRepository.findOneByUserId(userId);

    CommonUserService.assertUserExistence(user);

    const accessToken: string = this._jwtProvider.signAccessToken(user['_id']);

    const refreshToken: string = this._jwtProvider.signRefreshToken(
      user['_id'],
    );

    const output: SignInResponseDto = {
      accessToken,
      refreshToken,
    };

    await this._userRepository.updateRefreshToken(user['_id'], refreshToken);

    return output;
  }
}
