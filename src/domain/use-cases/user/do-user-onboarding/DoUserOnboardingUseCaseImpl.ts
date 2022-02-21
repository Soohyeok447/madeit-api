import { UpdateUserDto } from '../../../repositories/user/dtos/UpdateUserDto';
import { DoUserOnboardingUseCaseParams } from './dtos/DoUserOnboardingUseCaseParams';
import { InvalidUsernameException } from './exceptions/InvalidUsernameException';
import { UsernameConflictException } from './exceptions/UsernameConflictException';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { DoUserOnboardingResponse } from '../response.index';
import { Injectable } from '@nestjs/common';
import { DoUseronboardingUseCase } from './DoUserOnboardingUseCase';
import { UserModel } from '../../../models/UserModel';
import { DoUserOnboardingResponseDto } from './dtos/DoUserOnboardingResponseDto';

@Injectable()
export class DoUserOnboardingUseCaseImpl implements DoUseronboardingUseCase {
  constructor(private readonly _userRepository: UserRepository) { }

  public async execute({
    id,
    age,
    statusMessage,
    goal,
    username,
  }: DoUserOnboardingUseCaseParams): DoUserOnboardingResponse {
    const onboardingData: UpdateUserDto = this._convertToOnboardObj({ age, statusMessage, goal, username });

    const result: UserModel = await this._userRepository.update(id, onboardingData);

    const output: DoUserOnboardingResponseDto = this._mapToResponseDto(result)

    return output;
  }

  private _mapToResponseDto(result: UserModel): DoUserOnboardingResponseDto {
    const {
      status_message: _,
      created_at: __,
      refresh_token: ___,
      _id: ____,
      updated_at: _____,
      is_admin: ______,
      user_id: _______,
      provider: ________,
      ...others
    }: any = result;

    return {
      statusMessage: result['status_message'],
      ...others,
    };
  }

  private _convertToOnboardObj({ age, goal, statusMessage, username }): UpdateUserDto {
    return {
      age,
      goal,
      status_message: statusMessage,
      username,
    };
  }
}
