import { UserRepository } from '../../../repositories/user/UserRepository';
import { ValidateUsernameResponse } from '../response.index';
import { Injectable } from '@nestjs/common';
import { ValidateUsernameUseCase } from './ValidateUsernameUseCase';
import { ValidateUsernameUseCaseParams } from './dtos/ValidateUsernameUseCaseParams';
import { CommonUserService } from '../common/CommonUserService';

@Injectable()
export class ValidateUsernameUseCaseImpl implements ValidateUsernameUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  public async execute({
    username,
  }: ValidateUsernameUseCaseParams): ValidateUsernameResponse {
    const assertUsernameDuplication =
      await this._userRepository.findOneByUsername(username);

    CommonUserService.validateUsername(username, assertUsernameDuplication);

    return {};
  }
}
