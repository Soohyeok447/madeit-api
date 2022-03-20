import { Injectable } from '@nestjs/common';
import { HashProvider } from '../../../../domain/providers/HashProvider';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { ReissueAccessTokenResponse } from '../response.index';
import { ReissueAccessTokenUsecaseParams } from './dtos/ReissueAccessTokenUsecaseParams';
import { ReissueAccessTokenUseCase } from './ReissueAccessTokenUseCase';
import { JwtProvider } from '../../../providers/JwtProvider';
import { NoRefreshTokenException } from './exceptions/NoRefreshTokenException';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { InvalidRefreshTokenException } from './exceptions/InvalidRefreshTokenException';

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

    if (!user) throw new UserNotFoundException();

    if (!user.refreshToken) throw new NoRefreshTokenException();

    const isEqual = await this._hashProvider.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isEqual) throw new InvalidRefreshTokenException();

    const newAccessToken = this._jwtProvider.signAccessToken(user.id);

    return {
      accessToken: newAccessToken,
    };
  }
}
