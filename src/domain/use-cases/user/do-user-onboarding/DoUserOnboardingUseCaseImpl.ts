import { UpdateUserDto } from '../../../repositories/user/dtos/UpdateUserDto';
import { DoUserOnboardingUseCaseParams } from './dtos/DoUserOnboardingUseCaseParams';
import { InvalidUsernameException } from './exceptions/InvalidUsernameException';
import { UsernameConflictException } from './exceptions/UsernameConflictException';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { DoUserOnboardingResponse } from '../response.index';
import { Injectable } from '@nestjs/common';
import { DoUseronboardingUseCase } from './DoUserOnboardingUseCase';

 @Injectable()
export class DoUserOnboardingUseCaseImpl
  implements DoUseronboardingUseCase
{
  constructor(private readonly _userRepository: UserRepository) {}

  public async execute({
    id,
    birth,
    gender,
    job,
    username,
  }: DoUserOnboardingUseCaseParams): DoUserOnboardingResponse {
    const assertResult = await this._userRepository.findOneByUsername(username);

    if (assertResult) {
      throw new UsernameConflictException();
    }

    if (username.length < 2 || username.length > 8) {
      throw new InvalidUsernameException();
    }

    const onboardingData: UpdateUserDto = {
      birth,
      gender,
      job,
      username,
    };

    await this._userRepository.update(id, onboardingData);
  }
}
