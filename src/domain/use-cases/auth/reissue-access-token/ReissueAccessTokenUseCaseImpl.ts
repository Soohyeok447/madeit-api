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
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class ReissueAccessTokenUseCaseImpl
  implements ReissueAccessTokenUseCase
{
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _hashProvider: HashProvider,
    private readonly _jwtProvider: JwtProvider,
    private readonly _logger: LoggerProvider, // private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    refreshToken,
    id,
  }: ReissueAccessTokenUsecaseParams): ReissueAccessTokenResponse {
    this._logger.setContext('Reissue');

    const user: User = await this._userRepository.findOne(id);

    if (!user) {
      this._logger.error(`미가입 유저가 reissue API 호출. 호출자 id - ${id}`);

      throw new UserNotFoundException();
    }

    if (!user.refreshToken) {
      this._logger.error(
        `refreshToken이 없이 reissue API 호출. 호출자 id - ${id}`,
      );

      throw new NoRefreshTokenException();
    }

    const isEqual: boolean = await this._hashProvider.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isEqual) {
      this._logger.error(
        `보유중이지 않은 refreshToken을 가지고 재발급 시도. 호출자 id - ${id}`,
      );

      throw new InvalidRefreshTokenException();
    }

    const newAccessToken: string = this._jwtProvider.signAccessToken(user.id);

    return {
      accessToken: newAccessToken,
    };
  }
}
