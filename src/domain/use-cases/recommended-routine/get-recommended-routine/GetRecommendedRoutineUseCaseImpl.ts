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

@Injectable()
export class GetRecommendedRoutineUseCaseImpl
  implements GetRecommendedRoutineUseCase
{
  constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
  ) {}

  public async execute({
    recommendedRoutineId,
  }: GetRecommendedRoutineUseCaseParams): GetRecommendedRoutineResponse {
    const recommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    if (!recommendedRoutine) throw new RecommendedRoutineNotFoundException();

    const howToProveYouDidIt: HowToProveYouDidIt =
      RecommendedRoutineUtils.getHowToProveByCategory(
        recommendedRoutine.category,
      );

    //TODO populate 잘 확인해봅시다 findOne은 너무 비효율적
    const thumbnail = await this._imageRepository.findOne(
      recommendedRoutine.thumbnailId,
    );

    const thumbnailCDN = recommendedRoutine.thumbnailId
      ? await this._imageProvider.requestImageToCDN(thumbnail)
      : 'no image';

    const cardnews = await this._imageRepository.findOne(
      recommendedRoutine.cardnewsId,
    );

    const cardnewsCDN = recommendedRoutine.cardnewsId
      ? await this._imageProvider.requestImageToCDN(cardnews)
      : 'no image';

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
      cardnews: cardnewsCDN as string[],
      thumbnail: thumbnailCDN as string,
      point: recommendedRoutine.point,
      exp: recommendedRoutine.exp,
      howToProveScript: howToProveYouDidIt.script,
      howToProveImageUrl: howToProveYouDidIt.imageUrl,
    };
  }
}
