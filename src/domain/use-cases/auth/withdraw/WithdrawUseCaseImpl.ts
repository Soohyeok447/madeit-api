import { UserRepository } from '../../../repositories/user/UserRepository';
import { Injectable } from '@nestjs/common';
import { WithdrawUseCase } from './WithdrawUseCase';
import { WithDrawUseCaseParams } from './dtos/WithDrawUseCaseParams';
import { WithdrawResponse } from '../response.index';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';

@Injectable()
export class WithdrawUseCaseImpl implements WithdrawUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  public async execute({ userId }: WithDrawUseCaseParams): WithdrawResponse {
    const user = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    await this._userRepository.delete(userId);

    return {};
  }
}
