import { UserRepository } from '../../../repositories/user/UserRepository';
import { Injectable } from '@nestjs/common';
import { WithdrawUseCase } from './WithdrawUseCase';
import { WithDrawUseCaseParams } from './dtos/WithDrawUseCaseParams';
import { CommonUserService } from '../../user/common/CommonUserService';
import { WithdrawResponse } from '../response.index';

@Injectable()
export class WithdrawUseCaseImpl implements WithdrawUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  public async execute({ userId }: WithDrawUseCaseParams): WithdrawResponse {
    const user = await this._userRepository.findOne(userId);

    CommonUserService.assertUserExistence(user);

    await this._userRepository.delete(userId);

    return {};
  }
}
