import { Injectable } from '@nestjs/common';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ModifyRecommendedRoutineResponse } from '../response.index';
import { ModifyRecommendedRoutineUseCase } from './ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseParams } from './dtos/ModifyRecommendedRoutineUseCaseParams';
import { TitleConflictException } from './exceptions/TitleConflictException';
import {
  RecommendedRoutineUtils,
  HowToProveYouDidIt,
} from '../common/RecommendedRoutineUtils';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { UserNotAdminException } from '../../../common/exceptions/customs/UserNotAdminException';
import { RecommendedRoutineNotFoundException } from '../common/exceptions/RecommendedRoutineNotFoundException';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class ModifyRecommendedRoutineUseCaseImpl
  implements ModifyRecommendedRoutineUseCase
{
  public constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _userRepository: UserRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    userId,
    recommendedRoutineId,
    title,
    category,
    introduction,
    fixedFields,
    hour,
    minute,
    days,
    alarmVideoId,
    contentVideoId,
    timerDuration,
    price,
    point,
    exp,
  }: ModifyRecommendedRoutineUseCaseParams): ModifyRecommendedRoutineResponse {
    this._logger.setContext('ModifyRecommendedRoutine');

    const user: User = await this._userRepository.findOne(userId);

    if (!user) {
      this._logger.error(
        `미가입 유저가 추천루틴 수정 시도. 호출자 id - ${userId}`,
      );
      throw new UserNotFoundException();
    }

    if (!user.isAdmin) {
      this._logger.error(
        `비어드민 유저가 추천루틴 수정 시도. 호출자 id - ${userId}`,
      );
      throw new UserNotAdminException();
    }
    const recommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    if (!recommendedRoutine) {
      this._logger.error(`미존재 추천루틴 수정 시도. 호출자 id - ${userId}`);
      throw new RecommendedRoutineNotFoundException();
    }

    if (recommendedRoutine.title !== title) {
      const duplicatedTitle: RecommendedRoutine =
        await this._recommendRoutineRepository.findOneByRoutineName(title);

      if (duplicatedTitle) {
        this._logger.error(
          `중복된 이름을 갖도록 추천루틴 수정 시도. 호출자 id - ${userId}`,
        );
        throw new TitleConflictException();
      }
    }

    const updatedRecommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.update(recommendedRoutineId, {
        title,
        category,
        introduction,
        fixedFields,
        hour,
        minute,
        days,
        alarmVideoId,
        contentVideoId,
        timerDuration,
        price,
        point,
        exp,
      });

    if (!category) category = recommendedRoutine.category;

    const howToProveYouDidIt: HowToProveYouDidIt =
      RecommendedRoutineUtils.getHowToProveByCategory(category);

    return {
      id: updatedRecommendedRoutine.id,
      title: updatedRecommendedRoutine.title,
      category: updatedRecommendedRoutine.category,
      introduction: updatedRecommendedRoutine.introduction,
      fixedFields: updatedRecommendedRoutine.fixedFields,
      hour: updatedRecommendedRoutine.hour,
      minute: updatedRecommendedRoutine.minute,
      days: updatedRecommendedRoutine.days,
      alarmVideoId: updatedRecommendedRoutine.alarmVideoId,
      contentVideoId: updatedRecommendedRoutine.contentVideoId,
      timerDuration: updatedRecommendedRoutine.timerDuration,
      price: updatedRecommendedRoutine.price,
      cardnews: updatedRecommendedRoutine.cardnewsId,
      thumbnail: updatedRecommendedRoutine.thumbnailId,
      point: updatedRecommendedRoutine.point,
      exp: updatedRecommendedRoutine.exp,
      howToProveScript: howToProveYouDidIt.script,
      howToProveImageUrl: howToProveYouDidIt.imageUrl,
    };
  }
}
