import { Injectable } from '@nestjs/common';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { GetRecommendedRoutineResponse } from '../response.index';
import { GetRecommendedRoutineUseCase } from './GetRecommendedRoutineUseCase';
import { GetRecommendedRoutineUseCaseParams } from './dtos/GetRecommendedRoutineUseCaseParams';
import { ImageProvider } from '../../../providers/ImageProvider';
import {
  RecommendedRoutineUtils,
  HowToProveYouDidIt,
} from '../common/RecommendedRoutineUtils';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { RecommendedRoutineNotFoundException } from '../common/exceptions/RecommendedRoutineNotFoundException';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class GetRecommendedRoutineUseCaseImpl
  implements GetRecommendedRoutineUseCase
{
  public constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    recommendedRoutineId,
  }: GetRecommendedRoutineUseCaseParams): GetRecommendedRoutineResponse {
    this._logger.setContext('GetRecommendedRoutine');

    const recommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    if (!recommendedRoutine) {
      throw new RecommendedRoutineNotFoundException(
        this._logger.getContext(),
        `미존재 추천루틴 get 시도.`,
      );
    }

    const howToProveYouDidIt: HowToProveYouDidIt =
      RecommendedRoutineUtils.getHowToProveByCategory(
        recommendedRoutine.category,
      );

    return {
      id: recommendedRoutine.id,
      title: recommendedRoutine.title,
      category: recommendedRoutine.category,
      introduction: recommendedRoutine.introduction,
      fixedFields: recommendedRoutine.fixedFields,
      hour: recommendedRoutine.hour,
      minute: recommendedRoutine.minute,
      days: recommendedRoutine.days,
      alarmVideoId: recommendedRoutine.alarmVideoId,
      contentVideoId: recommendedRoutine.contentVideoId,
      timerDuration: recommendedRoutine.timerDuration,
      price: recommendedRoutine.price,
      cardnewsUrl: [recommendedRoutine.cardnewsId],
      thumbnailUrl: recommendedRoutine.youtubeThumbnailUrl,
      point: recommendedRoutine.point,
      exp: recommendedRoutine.exp,
      howToProveScript: howToProveYouDidIt.script,
      howToProveImageUrl: howToProveYouDidIt.imageUrl,
    };
  }
}
