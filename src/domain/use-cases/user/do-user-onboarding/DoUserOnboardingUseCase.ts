import { UpdateUserDto } from '../../../repositories/user/dtos/UpdateUserDto';
import { DoUserOnboardingUseCaseDto } from './dtos/DoUserOnboardingUseCaseDto';
import { InvalidUsernameException } from './exceptions/InvalidUsernameException';
import { UsernameConflictException } from './exceptions/UsernameConflictException';
import { UseCase } from '../../UseCase';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { DoUserOnboardingResponse } from '../response.index';
import { Injectable } from '@nestjs/common';

/**
 * 간단 유저정보 저장
 */
 @Injectable()
export class DoUserOnboardingUseCase
  implements UseCase<DoUserOnboardingUseCaseDto, DoUserOnboardingResponse>
{
  constructor(private readonly _userRepository: UserRepository) {}

  public async execute({
    id,
    birth,
    gender,
    job,
    username,
  }: DoUserOnboardingUseCaseDto): DoUserOnboardingResponse {
    console.log('이건 do user onboarinding 이에요')

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
