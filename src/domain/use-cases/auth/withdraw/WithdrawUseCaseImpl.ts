import { UserRepository } from '../../../repositories/user/UserRepository';
import { Injectable } from '@nestjs/common';
import { WithdrawUseCase } from './WithdrawUseCase';
import { WithDrawUseCaseParams } from './dtos/WithDrawUseCaseParams';
import { WithdrawResponse } from '../response.index';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';

@Injectable()
export class WithdrawUseCaseImpl implements WithdrawUseCase {
  public constructor(private readonly _userRepository: UserRepository) {}

  public async execute({ userId }: WithDrawUseCaseParams): WithdrawResponse {
    const user: User = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    await this._userRepository.delete(userId);

    return {};
  }
}
