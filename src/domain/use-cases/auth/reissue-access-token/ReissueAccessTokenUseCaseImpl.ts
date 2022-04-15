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
      throw new UserNotFoundException(
        this._logger.getContext(),
        `미가입 유저가 reissue API 호출.`,
      );
    }

    if (!user.refreshToken) {
      throw new NoRefreshTokenException(
        this._logger.getContext(),
        `refreshToken이 없이 reissue API 호출.`,
      );
    }

    const isEqual: boolean = await this._hashProvider.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isEqual) {
      throw new InvalidRefreshTokenException(
        this._logger.getContext(),
        `보유중이지 않은 refreshToken을 가지고 재발급 시도.`,
      );
    }

    const newAccessToken: string = this._jwtProvider.signAccessToken(user.id);

    return {
      accessToken: newAccessToken,
    };
  }
}
