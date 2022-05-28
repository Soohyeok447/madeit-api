import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { PatchAvatarResponse } from '../response.index';
import { PatchAvatarUseCase } from './PatchAvatarUseCase';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { CompleteRoutineRepository } from '../../../repositories/complete-routine/CompleteRoutineRepository';
import { CompleteRoutine } from '../../../entities/CompleteRoutine';
import { MomentProvider } from '../../../providers/MomentProvider';
import { ImageRepositoryV2 } from '../../../repositories/imageV2/ImageRepositoryV2';
import { PatchAvatarUseCaseParamsV2 } from './dtos/PatchAvatarUseCaseParamsV2';
import { ImageV2 } from '../../../entities/ImageV2';
import { ImageProviderV2 } from '../../../providers/ImageProviderV2';

@Injectable()
export class PatchAvatarUseCaseImplV2 implements PatchAvatarUseCase {
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
    avatarId,
  }: PatchAvatarUseCaseParamsV2): PatchAvatarResponse {
    this.logger.setContext('PatchAvatar');

    const user: User = await this.userRepository.findOne(id);

    if (!user) {
      throw new UserNotFoundException(
        this.logger.getContext(),
        `미가입 유저가 아바타 수정 API 호출.`,
      );
    }

    const avatar: ImageV2 = await this.imageRepositoryV2.findOne(avatarId);

    const updatedUser: User = await this.userRepository.update(id, {
      avatarId,
    });

    const avatarImageUrl: string = await this.imageProviderV2.getImageUrl(
      avatar,
    );

    const completeRoutines: CompleteRoutine[] =
      await this.completeRoutineRepository.findAllByUserId(user.id);

    const didRoutinesInMonth: number =
      this.momentProvider.getCountOfRoutinesCompletedInThisMonth(
        completeRoutines,
      );

    return {
      username: updatedUser.username,
      age: updatedUser.age,
      goal: updatedUser.goal,
      statusMessage: updatedUser.statusMessage,
      avatar: avatarImageUrl,
      point: updatedUser.point,
      exp: updatedUser.exp,
      didRoutinesInTotal: completeRoutines.length,
      didRoutinesInMonth,
      level: updatedUser.level,
    };
  }
}
