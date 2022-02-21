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
  constructor(private readonly _userRepository: UserRepository) { }

  public async execute({
    id,
    username,
    age,
    statusMessage,
    goal,
  }: ModifyUserUsecaseParams): ModifyUserResponse {
    const onboardingData: UpdateUserDto = this._convertToOnboardObj(age, goal, statusMessage, username);

    await this._userRepository.update(id, onboardingData);
  }

  private _convertToOnboardObj(age: number, goal: string, statusMessage: string, username: string): UpdateUserDto {
    return {
      age,
      goal,
      status_message: statusMessage,
      username,
    };
  }
}
