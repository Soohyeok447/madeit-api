import { Injectable } from '@nestjs/common';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { AddRecommendedRoutineResponse } from '../response.index';
import { ModifyRecommendedRoutineUseCase } from './ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseParams } from './dtos/ModifyRecommendedRoutineUseCaseParams';
import { TitleConflictException } from './exceptions/TitleConflictException';
import {
  CommonRecommendedRoutineService,
  HowToProveYouDidIt,
} from '../common/CommonRecommendedRoutineService';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { UserNotAdminException } from '../../user/common/exceptions/UserNotAdminException';
import { RecommendedRoutineNotFoundException } from '../common/exceptions/RecommendedRoutineNotFoundException';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';

@Injectable()
export class ModifyRecommendedRoutineUseCaseImpl
  implements ModifyRecommendedRoutineUseCase
{
  constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _userRepository: UserRepository,
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
  }: ModifyRecommendedRoutineUseCaseParams): AddRecommendedRoutineResponse {
    const user = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    if (!user.isAdmin) throw new UserNotAdminException();

    const recommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    if (!recommendedRoutine) throw new RecommendedRoutineNotFoundException();

    if (recommendedRoutine.title !== title) {
      const duplicatedTitle: RecommendedRoutine =
        await this._recommendRoutineRepository.findOneByRoutineName(title);

      if (duplicatedTitle) throw new TitleConflictException();
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
      CommonRecommendedRoutineService.getHowToProveByCategory(category);

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
      cardnews: [updatedRecommendedRoutine.cardnewsId],
      thumbnail: updatedRecommendedRoutine.thumbnailId,
      point: updatedRecommendedRoutine.point,
      exp: updatedRecommendedRoutine.exp,
      howToProveScript: howToProveYouDidIt.script,
      howToProveImageUrl: howToProveYouDidIt.imageUrl,
    };
  }
}
