import { UserRepository } from '../../../repositories/user/UserRepository';
import { ValidateUsernameResponse } from '../response.index';
import { Injectable } from '@nestjs/common';
import { ValidateUsernameUseCase } from './ValidateUsernameUseCase';
import { ValidateUsernameUseCaseParams } from './dtos/ValidateUsernameUseCaseParams';
import { CommonUserService } from '../common/CommonUserService';
import { InvalidUsernameException } from './exceptions/InvalidUsernameException';

@Injectable()
export class ValidateUsernameUseCaseImpl implements ValidateUsernameUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  public async execute({
    username,
  }: ValidateUsernameUseCaseParams): ValidateUsernameResponse {
    const isValid: boolean = CommonUserService.validateUsername(username);

    if (!isValid) throw new InvalidUsernameException();

    return {};
  }
}
