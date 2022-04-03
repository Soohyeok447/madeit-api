import { ValidateUsernameResponse } from '../response.index';
import { Injectable } from '@nestjs/common';
import { ValidateUsernameUseCase } from './ValidateUsernameUseCase';
import { ValidateUsernameUseCaseParams } from './dtos/ValidateUsernameUseCaseParams';
import { UserUtils } from '../common/UserUtils';
import { InvalidUsernameException } from './exceptions/InvalidUsernameException';

@Injectable()
export class ValidateUsernameUseCaseImpl implements ValidateUsernameUseCase {
  public async execute({
    username,
  }: ValidateUsernameUseCaseParams): ValidateUsernameResponse {
    const isValid: boolean = UserUtils.validateUsername(username);

    if (!isValid) throw new InvalidUsernameException();

    return {};
  }
}
