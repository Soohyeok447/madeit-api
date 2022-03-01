import { Injectable } from '@nestjs/common';
import { RecommendedRoutineModel } from '../../../models/RecommendedRoutineModel';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { GetRecommendedRoutineResponse } from '../response.index';
import { GetRecommendedRoutineUseCase } from './GetRecommendedRoutineUseCase';
import { GetRecommendedRoutineResponseDto } from './dtos/GetRecommendedRoutineResponseDto';
import { GetRecommendedRoutineUseCaseParams } from './dtos/GetRecommendedRoutineUseCaseParams';
import { ImageProvider } from '../../../providers/ImageProvider';
import { CommonRecommendedRoutineService } from '../service/CommonRecommendedRoutineService';

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
    const routine: RecommendedRoutineModel =
      await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    CommonRecommendedRoutineService.assertRoutineExistence(routine);

    const output: GetRecommendedRoutineResponseDto =
      await this._mapModelToResponseDto(routine);

    return output;
  }

  private async _mapModelToResponseDto(
    routine: RecommendedRoutineModel,
  ): Promise<GetRecommendedRoutineResponseDto> {
    let thumbnailUrl;

    if (routine['thumbnail_id']) {
      const thumbnailModel = this._imageProvider.mapDocumentToImageModel(
        routine['thumbnail_id'],
      );

      thumbnailUrl = await this._imageProvider.requestImageToCloudfront(
        thumbnailModel,
      );
    }

    let cardnewsUrl;

    if (routine['cardnews_id']) {
      const cardnewsModel = this._imageProvider.mapDocumentToImageModel(
        routine['cardnews_id'],
      );

      cardnewsUrl = await this._imageProvider.requestImageToCloudfront(
        cardnewsModel,
      );
    }

    return {
      id: routine['_id'],
      title: routine['title'],
      category: routine['category'],
      introduction: routine['introduction'],
      fixedFields: routine['fixed_fields'],
      hour: routine['hour'],
      minute: routine['minute'],
      days: routine['days'],
      alarmVideoId: routine['alarm_video_id'],
      contentVideoId: routine['content_video_id'],
      timerDuration: routine['timer_duration'],
      price: routine['price'],
      cardnews: cardnewsUrl,
      thumbnail: thumbnailUrl,
      point: routine['point'],
      exp: routine['exp'],
    };
  }
}
