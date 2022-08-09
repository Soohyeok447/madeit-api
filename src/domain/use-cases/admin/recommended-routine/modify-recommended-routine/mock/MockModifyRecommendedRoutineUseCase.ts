import { Injectable } from '@nestjs/common';
import { RecommendedRoutine } from '../../../../../entities/RecommendedRoutine';
import { RecommendedRoutineRepository } from '../../../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { RecommendedRoutineNotFoundException } from '../../../../recommended-routine/common/exceptions/RecommendedRoutineNotFoundException';
import {
  HowToProveYouDidIt,
  RecommendedRoutineUtils,
} from '../../../../recommended-routine/common/RecommendedRoutineUtils';
import { ModifyRecommendedRoutineResponseDto } from '../dtos/ModifyRecommendedRoutineResponseDto';

import { ModifyRecommendedRoutineUseCaseParams } from '../dtos/ModifyRecommendedRoutineUseCaseParams';
import { TitleConflictException } from '../exceptions/TitleConflictException';
import { ModifyRecommendedRoutineUseCase } from '../ModifyRecommendedRoutineUseCase';

@Injectable()
export class MockModifyRecommendedRoutineUseCaseImpl
  implements ModifyRecommendedRoutineUseCase {
  public constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
  ) { }

  public async execute({
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
  }: ModifyRecommendedRoutineUseCaseParams): Promise<ModifyRecommendedRoutineResponseDto> {
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
      cardnewsUrl: updatedRecommendedRoutine.cardnewsId,
      thumbnail: updatedRecommendedRoutine.thumbnailId,
      point: updatedRecommendedRoutine.point,
      exp: updatedRecommendedRoutine.exp,
      howToProveScript: howToProveYouDidIt.script,
      howToProveImageUrl: howToProveYouDidIt.imageUrl,
    };
  }
}
