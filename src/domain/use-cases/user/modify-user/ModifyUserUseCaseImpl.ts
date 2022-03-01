import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ModifyUserUsecaseParams } from './dtos/ModifyUserUsecaseParams';
import { UpdateUserDto } from '../../../repositories/user/dtos/UpdateUserDto';
import { ModifyUserResponse } from '../response.index';
import { ModifyUserUseCase } from './ModifyUserUseCase';
import { CommonUserService } from '../service/CommonUserService';
import { UserModel } from '../../../models/UserModel';

@Injectable()
export class ModifyUserUseCaseImpl implements ModifyUserUseCase {
  constructor(private readonly _userRepository: UserRepository) {}

  public async execute({
    id,
    username,
    age,
    statusMessage,
    goal,
  }: ModifyUserUsecaseParams): ModifyUserResponse {
    const user: UserModel = await this._userRepository.findOne(id);

    CommonUserService.assertUserExistence(user);

    const onboardingData: UpdateUserDto = this._convertToOnboardObj(
      age,
      goal,
      statusMessage,
      username,
    );

    await this._userRepository.update(id, onboardingData);
 
    return {};
  }

  private _convertToOnboardObj(
    age: number,
    goal: string,
    statusMessage: string,
    username: string,
  ): UpdateUserDto {
    return {
      age,
      goal,
      status_message: statusMessage,
      username,
    };
  }
}
