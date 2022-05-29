import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { FindUserResponse } from '../response.index';
import { FindUserUsecaseParams } from './dtos/FindUserUsecaseParams';
import { FindUserUseCase } from './FindUserUseCase';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { CompleteRoutineRepository } from '../../../repositories/complete-routine/CompleteRoutineRepository';
import { CompleteRoutine } from '../../../entities/CompleteRoutine';
import { MomentProvider } from '../../../providers/MomentProvider';
import { ImageProviderV2 } from '../../../providers/ImageProviderV2';
import { ImageRepositoryV2 } from '../../../repositories/imageV2/ImageRepositoryV2';
import { ImageV2 } from '../../../entities/ImageV2';

@Injectable()
export class FindUserUseCaseImplV2 implements FindUserUseCase {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly imageProviderV2: ImageProviderV2,
    private readonly imageRepositoryV2: ImageRepositoryV2,
    private readonly completeRoutineRepository: CompleteRoutineRepository,
    private readonly momentProvider: MomentProvider,
    private readonly logger: LoggerProvider,
  ) {}

  public async execute({ id }: FindUserUsecaseParams): FindUserResponse {
    this.logger.setContext('FindUser');

    const user: User = await this.userRepository.findOne(id);

    if (!user) {
      throw new UserNotFoundException(
        this.logger.getContext(),
        `미가입 유저가 find API 호출.`,
      );
    }

    const avatar: ImageV2 = await this.imageRepositoryV2.findOne(user.avatarId);

    const avatarUrl: string = avatar
      ? this.imageProviderV2.getImageUrl(avatar)
      : this.imageProviderV2.getDefaultAvatarUrl();

    const completeRoutines: CompleteRoutine[] =
      await this.completeRoutineRepository.findAllByUserId(user.id);

    const didRoutinesInMonth: number =
      this.momentProvider.getCountOfRoutinesCompletedInThisMonth(
        completeRoutines,
      );

    return {
      username: user.username,
      age: user.age,
      goal: user.goal,
      statusMessage: user.statusMessage,
      avatarUrl,
      point: user.point,
      exp: user.exp,
      didRoutinesInTotal: completeRoutines.length,
      didRoutinesInMonth,
      level: user.level,
    };
  }
}
