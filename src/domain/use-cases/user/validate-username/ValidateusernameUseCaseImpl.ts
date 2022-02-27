import { UserRepository } from '../../../repositories/user/UserRepository';
import { ValidateUsernameResponse } from '../response.index';
import { Injectable } from '@nestjs/common';
import { ValidateUsernameUseCase } from './ValidateUsernameUseCase';
import { ValidateUsernameUseCaseParams } from './dtos/ValidateUsernameUseCaseParams';
import { UsernameConflictException } from './exceptions/UsernameConflictException';
import { InvalidUsernameException } from './exceptions/InvalidUsernameException';

@Injectable()
export class ValidateUsernameUseCaseImpl implements ValidateUsernameUseCase {
  constructor(private readonly _userRepository: UserRepository) { }

  public async execute({
    username,
  }: ValidateUsernameUseCaseParams): ValidateUsernameResponse {
    const assertUsernameDuplication = await this._userRepository.findOneByUsername(username);

    if (assertUsernameDuplication) {
      throw new UsernameConflictException();
    }

    if (username.length < 2 || username.length > 8) {
      throw new InvalidUsernameException();
    }
  }
}
