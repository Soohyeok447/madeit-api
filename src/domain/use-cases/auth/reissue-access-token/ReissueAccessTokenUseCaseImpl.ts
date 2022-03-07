import { Injectable } from '@nestjs/common';
import { HashProvider } from '../../../../domain/providers/HashProvider';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { ReissueAccessTokenResponse } from '../response.index';
import { ReissueAccessTokenUsecaseParams } from './dtos/ReissueAccessTokenUsecaseParams';
import { ReissueAccessTokenUseCase } from './ReissueAccessTokenUseCase';
import { CommonUserService } from '../../user/service/CommonUserService';
import { JwtProvider } from '../../../providers/JwtProvider';

@Injectable()
export class ReissueAccessTokenUseCaseImpl
  implements ReissueAccessTokenUseCase
{
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _hashProvider: HashProvider,
    private readonly _jwtProvider: JwtProvider,
  ) {}

  public async execute({
    refreshToken,
    id,
  }: ReissueAccessTokenUsecaseParams): ReissueAccessTokenResponse {
    const user = await this._userRepository.findOne(id);

    CommonUserService.assertUserExistence(user);

    const result: boolean = await this._hashProvider.compare(
      refreshToken,
      user['refresh_token'],
    );

    if (!result) return null;

    const newAccessToken = this._jwtProvider.signAccessToken(user['_id']);

    return {
      accessToken: newAccessToken,
    };
  }
}
