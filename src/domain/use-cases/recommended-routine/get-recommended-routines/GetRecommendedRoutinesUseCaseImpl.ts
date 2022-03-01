import { Injectable } from '@nestjs/common';
import { RecommendedRoutineModel } from '../../../models/RecommendedRoutineModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { GetRecommendedRoutinesResponse } from '../response.index';
import {
  GetRecommendedRoutinesResponseDto,
  RecommendedRoutineItems,
} from './dtos/GetRecommendedRoutinesResponseDto';
import { GetRecommendedRoutinesUseCaseParams } from './dtos/GetRecommendedRoutinesUseCaseParams';
import { GetRecommendedRoutinesUseCase } from './GetRecommendedRoutinesUseCase';

@Injectable()
export class GetRecommendedRoutinesUseCaseImpl
  implements GetRecommendedRoutinesUseCase
{
  constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _imageProvider: ImageProvider,
  ) {}

  public async execute({
    next,
    size,
  }: GetRecommendedRoutinesUseCaseParams): GetRecommendedRoutinesResponse {
    const recommendedRoutines: RecommendedRoutineModel[] | [] =
      await this._recommendRoutineRepository.findAll(size, next);

    const output: GetRecommendedRoutinesResponseDto =
      await this._mapModelToResponseDto(recommendedRoutines, size, next);

    return output;
  }

  private async _mapModelToResponseDto(
    recommendedRoutines: RecommendedRoutineModel[] | [],
    size: number,
    next: string,
  ): Promise<GetRecommendedRoutinesResponseDto> {
    if (!recommendedRoutines.length) {
      return {
        hasMore: false,
        nextCursor: null,
        items: [],
      };
    }

    const hasMore = recommendedRoutines.length < size ? false : true;

    const nextCursor = hasMore
      ? recommendedRoutines[recommendedRoutines.length - 1]['_id']
      : null;

    const mappedItems = await Promise.all(
      recommendedRoutines.map(async (routine) => {
        // image mapping
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
          fixedFields: routine['fixedFields'],
          hour: routine['hour'],
          minute: routine['minute'],
          days: routine['days'],
          alarmVideoId: routine['alarmVideoId'],
          contentVideoId: routine['contentVideoId'],
          timerDuration: routine['timerDuration'],
          price: routine['price'],
          point: routine['point'],
          exp: routine['exp'],
          introduction: routine['introduction'],
          relatedProducts: routine['related_products'],
          thumbnail: thumbnailUrl,
          cardnews: cardnewsUrl,
        };
      }),
    );

    return {
      hasMore,
      nextCursor,
      items: mappedItems,
    };
  }
}
