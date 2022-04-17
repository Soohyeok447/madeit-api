import { ValidateUsernameResponse } from '../response.index';
import { Injectable } from '@nestjs/common';
import { ValidateUsernameUseCase } from './ValidateUsernameUseCase';
import { ValidateUsernameUseCaseParams } from './dtos/ValidateUsernameUseCaseParams';
import { UserUtils } from '../common/UserUtils';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { User } from '../../../entities/User';

@Injectable()
export class ValidateUsernameUseCaseImpl implements ValidateUsernameUseCase {
  public constructor(private readonly _userRepository: UserRepository) {}

  public async execute({
    username,
  }: ValidateUsernameUseCaseParams): ValidateUsernameResponse {
    const isValid: boolean = UserUtils.validateUsername(username);

    if (!isValid)
      return {
        result: false,
        errorCode: 1,
        message: '닉네임은 2자 이상 8자 이하여야 합니다',
      };

    const user: User = await this._userRepository.findOneByUsername(username);

    if (user)
      return {
        result: false,
        errorCode: 2,
        message: '중복된 닉네임 입니다',
      };

    return {
      result: true,
    };
  }
}
