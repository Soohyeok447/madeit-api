import { UserRepository } from '../../../repositories/user/UserRepository';
import { Injectable } from '@nestjs/common';
import { WithdrawUseCase } from './WithdrawUseCase';
import { WithDrawUseCaseParams } from './dtos/WithDrawUseCaseParams';
import { WithdrawResponse } from '../response.index';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class WithdrawUseCaseImpl implements WithdrawUseCase {
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({ userId }: WithDrawUseCaseParams): WithdrawResponse {
    this._logger.setContext('Withdraw');

    const user: User = await this._userRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException(
        this._logger.getContext(),
        `미가입 유저가 회원탈퇴 API를 호출. 호출자 id - ${userId}`,
      );
    }

    await this._userRepository.delete(userId);

    this._logger.info(`${userId} 가 회원탈퇴`);

    return {};
  }
}
