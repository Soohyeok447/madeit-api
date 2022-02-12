import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ModifyUserUsecaseParams } from './dtos/ModifyUserUsecaseParams';
import { UpdateUserDto } from '../../../repositories/user/dtos/UpdateUserDto';
import { InvalidUsernameException } from '../do-user-onboarding/exceptions/InvalidUsernameException';
import { UsernameConflictException } from '../do-user-onboarding/exceptions/UsernameConflictException';
import { ModifyUserResponse } from '../response.index';
import { ModifyUserUseCase } from './ModifyUserUseCase';

@Injectable()
export class ModifyUserUseCaseImpl implements ModifyUserUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  public async execute({
    id,
    username,
    birth,
    job,
    gender,
  }: ModifyUserUsecaseParams): ModifyUserResponse {
    if (username) {
      const assertUserResult = await this._userRepository.findOneByUsername(
        username,
      );

      if (assertUserResult) {
        throw new UsernameConflictException();
      }

      if (username.length < 2 || username.length > 8) {
        throw new InvalidUsernameException();
      }
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
