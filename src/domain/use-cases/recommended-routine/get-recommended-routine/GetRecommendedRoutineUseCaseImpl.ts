import { Injectable } from '@nestjs/common';
import { RecommendedRoutineModel } from '../../../models/RecommendedRoutineModel';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { GetRecommendedRoutineResponse } from '../response.index';
import { GetRecommendedRoutineUseCase } from './GetRecommendedRoutineUseCase';
import { GetRecommendedRoutineResponseDto } from './dtos/GetRecommendedRoutineResponseDto';
import { GetRecommendedRoutineUseCaseParams } from './dtos/GetRecommendedRoutineUseCaseParams';
import { ImageProvider } from '../../../providers/ImageProvider';
import {
  CommonRecommendedRoutineService,
  HowToProveYouDidIt,
} from '../common/CommonRecommendedRoutineService';

@Injectable()
export class GetRecommendedRoutineUseCaseImpl
  implements GetRecommendedRoutineUseCase
{
  constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _imageProvider: ImageProvider,
  ) {}

  public async execute({
    recommendedRoutineId,
  }: GetRecommendedRoutineUseCaseParams): GetRecommendedRoutineResponse {
    const recommendedRoutine: RecommendedRoutineModel =
      await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    CommonRecommendedRoutineService.assertRecommendedRoutineExistence(
      recommendedRoutine,
    );

    const howToProveYouDidIt: HowToProveYouDidIt =
      CommonRecommendedRoutineService.getHowToProveByCategory(
        recommendedRoutine['category'],
      );

    const output: GetRecommendedRoutineResponseDto =
      await this._mapModelToResponseDto(
        recommendedRoutine,
        howToProveYouDidIt.script,
        howToProveYouDidIt.imageUrl,
      );

    return output;
  }

  private async _mapModelToResponseDto(
    recommendedRoutine: RecommendedRoutineModel,
    howToProveScript: string,
    howToProveImageUrl: string,
  ): Promise<GetRecommendedRoutineResponseDto> {
    const thumbnailCDN = recommendedRoutine['thumbnail_id']
      ? await this._imageProvider.requestImageToCDN(
          recommendedRoutine['thumbnail_id'],
        )
      : null;

    const cardNewsCDN = recommendedRoutine['cardnews_id']
      ? await this._imageProvider.requestImageToCDN(
          recommendedRoutine['cardnews_id'],
        )
      : null;

    return {
      id: recommendedRoutine['_id'],
      title: recommendedRoutine['title'],
      category: recommendedRoutine['category'],
      introduction: recommendedRoutine['introduction'],
      fixedFields: recommendedRoutine['fixed_fields'],
      hour: recommendedRoutine['hour'],
      minute: recommendedRoutine['minute'],
      days: recommendedRoutine['days'],
      alarmVideoId: recommendedRoutine['alarm_video_id'],
      contentVideoId: recommendedRoutine['content_video_id'],
      timerDuration: recommendedRoutine['timer_duration'],
      price: recommendedRoutine['price'],
      cardnews: cardNewsCDN as string[],
      thumbnail: thumbnailCDN as string,
      point: recommendedRoutine['point'],
      exp: recommendedRoutine['exp'],
      howToProveScript,
      howToProveImageUrl,
    };
  }
}
