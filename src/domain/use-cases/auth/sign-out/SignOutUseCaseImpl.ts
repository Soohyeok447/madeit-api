import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { SignOutResponse } from '../response.index';
import { SignOutUseCaseParams } from './dtos/SignOutUseCaseParams';
import { UserAlreadySignOutException } from './exceptions/UserAlreadySignOutException';
import { SignOutUseCase } from './SignOutUseCase';

@Injectable()
export class SignOutUseCaseImpl implements SignOutUseCase {
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({ userId }: SignOutUseCaseParams): SignOutResponse {
    this._logger.setContext('SignOut');

    const user: User = await this._userRepository.findOne(userId);

    if (!user) {
      this._logger.error(
        `미가입 유저가 로그아웃 API를 호출. 호출자 id - ${userId}`,
      );

      throw new UserNotFoundException();
    }

    if (!user.refreshToken) {
      this._logger.error(
        `이미 로그아웃한 상태에서 로그아웃 API를 호출. 호출자 id - ${userId}`,
      );

      throw new UserAlreadySignOutException();
    }

    await this._userRepository.updateRefreshToken(user.id, null);

    return {};
  }
}
