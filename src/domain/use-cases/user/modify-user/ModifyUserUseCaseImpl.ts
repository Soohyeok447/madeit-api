import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ModifyUserUsecaseParams } from './dtos/ModifyUserUsecaseParams';
import { ModifyUserResponse } from '../response.index';
import { ModifyUserUseCase } from './ModifyUserUseCase';
import { UserUtils } from '../common/UserUtils';
import { ImageProvider } from '../../../providers/ImageProvider';
import { UsernameConflictException } from '../validate-username/exceptions/UsernameConflictException';
import { InvalidUsernameException } from '../validate-username/exceptions/InvalidUsernameException';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { CompleteRoutineRepository } from '../../../repositories/complete-routine/CompleteRoutineRepository';
import { MomentProvider } from '../../../providers/MomentProvider';
import { CompleteRoutine } from '../../../entities/CompleteRoutine';

@Injectable()
export class ModifyUserUseCaseImpl implements ModifyUserUseCase {
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _completeRoutineRepository: CompleteRoutineRepository,
    private readonly _momentProvider: MomentProvider,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    id,
    username,
    age,
    statusMessage,
    goal,
  }: ModifyUserUsecaseParams): ModifyUserResponse {
    this._logger.setContext('ModifyUser');

    const existingUser: User = await this._userRepository.findOne(id);

    if (!existingUser) {
      throw new UserNotFoundException(
        this._logger.getContext(),
        `미가입 유저가 modify API 호출.`,
      );
    }

    if (existingUser.username !== username) {
      const existingUsername: User =
        await this._userRepository.findOneByUsername(username);

      if (existingUsername) {
        throw new UsernameConflictException(
          this._logger.getContext(),
          `중복된 닉네임 검사 API 호출하지 않고 Modify API 호출.`,
        );
      }

      const isValid: boolean = UserUtils.validateUsername(username);

      if (!isValid) {
        throw new InvalidUsernameException(
          this._logger.getContext(),
          `닉네임 유효성 검사 거치지 않고 modify API 호출.`,
        );
      }
    }

    const modifiedUser: User = await this._userRepository.update(id, {
      age,
      goal,
      statusMessage,
      username,
    });

    const avatarUrl: string | string[] =
      await this._imageProvider.requestImageToCDN(modifiedUser.avatarId);

    const completeRoutines: CompleteRoutine[] =
      await this._completeRoutineRepository.findAllByUserId(modifiedUser.id);

    const didRoutinesInMonth: number =
      this._momentProvider.getCountOfRoutinesCompletedInThisMonth(
        completeRoutines,
      );

    return {
      username: modifiedUser.username,
      age: modifiedUser.age,
      goal: modifiedUser.goal,
      statusMessage: modifiedUser.statusMessage,
      avatarUrl: avatarUrl as string,
      point: modifiedUser.point,
      exp: modifiedUser.exp,
      didRoutinesInTotal: completeRoutines.length,
      didRoutinesInMonth,
      level: modifiedUser.level,
    };
  }
}
