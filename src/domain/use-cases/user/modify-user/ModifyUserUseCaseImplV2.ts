import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ModifyUserUsecaseParams } from './dtos/ModifyUserUsecaseParams';
import { ModifyUserResponse } from '../response.index';
import { ModifyUserUseCase } from './ModifyUserUseCase';
import { UserUtils } from '../common/UserUtils';
import { UsernameConflictException } from '../validate-username/exceptions/UsernameConflictException';
import { InvalidUsernameException } from '../validate-username/exceptions/InvalidUsernameException';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { CompleteRoutineRepository } from '../../../repositories/complete-routine/CompleteRoutineRepository';
import { MomentProvider } from '../../../providers/MomentProvider';
import { CompleteRoutine } from '../../../entities/CompleteRoutine';
import { ImageProviderV2 } from '../../../providers/ImageProviderV2';
import { ImageRepositoryV2 } from '../../../repositories/imageV2/ImageRepositoryV2';
import { ImageV2 } from '../../../entities/ImageV2';

@Injectable()
export class ModifyUserUseCaseImplV2 implements ModifyUserUseCase {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly imageProviderV2: ImageProviderV2,
    private readonly imageRepositoryV2: ImageRepositoryV2,
    private readonly completeRoutineRepository: CompleteRoutineRepository,
    private readonly momentProvider: MomentProvider,
    private readonly logger: LoggerProvider,
  ) {}

  public async execute({
    id,
    username,
    age,
    statusMessage,
    goal,
  }: ModifyUserUsecaseParams): ModifyUserResponse {
    this.logger.setContext('ModifyUser');

    const existingUser: User = await this.userRepository.findOne(id);

    if (!existingUser) {
      throw new UserNotFoundException(
        this.logger.getContext(),
        `미가입 유저가 modify API 호출.`,
      );
    }

    if (existingUser.username !== username) {
      const existingUsername: User =
        await this.userRepository.findOneByUsername(username);

      if (existingUsername) {
        throw new UsernameConflictException(
          this.logger.getContext(),
          `중복된 닉네임 검사 API 호출하지 않고 Modify API 호출.`,
        );
      }

      const isValid: boolean = UserUtils.validateUsername(username);

      if (!isValid) {
        throw new InvalidUsernameException(
          this.logger.getContext(),
          `닉네임 유효성 검사 거치지 않고 modify API 호출.`,
        );
      }
    }

    const modifiedUser: User = await this.userRepository.update(id, {
      age,
      goal,
      statusMessage,
      username,
    });

    const avatar: ImageV2 = await this.imageRepositoryV2.findOne(
      modifiedUser.avatarId,
    );

    const avatarUrl: string = avatar
      ? this.imageProviderV2.getImageUrl(avatar)
      : this.imageProviderV2.getDefaultAvatarUrl();

    const completeRoutines: CompleteRoutine[] =
      await this.completeRoutineRepository.findAllByUserId(modifiedUser.id);

    const didRoutinesInMonth: number =
      this.momentProvider.getCountOfRoutinesCompletedInThisMonth(
        completeRoutines,
      );

    return {
      username: modifiedUser.username,
      age: modifiedUser.age,
      goal: modifiedUser.goal,
      statusMessage: modifiedUser.statusMessage,
      avatarUrl,
      point: modifiedUser.point,
      exp: modifiedUser.exp,
      didRoutinesInTotal: completeRoutines.length,
      didRoutinesInMonth,
      level: modifiedUser.level,
    };
  }
}
