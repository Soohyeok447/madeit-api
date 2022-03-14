import { Injectable } from '@nestjs/common';
import { Category } from '../../../common/enums/Category';
import { RecommendedRoutineModel } from '../../../models/RecommendedRoutineModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import {
  CommonRecommendedRoutineService,
  HowToProveYouDidIt,
} from '../common/CommonRecommendedRoutineService';
import { GetRecommendedRoutinesByCategoryResponse } from '../response.index';
import { GetRecommendedRoutinesByCategoryResponseDto } from './dtos/GetRecommendedRoutinesByCategoryResponseDto';
import { GetRecommendedRoutinesByCategoryUseCaseParams } from './dtos/GetRecommendedRoutinesByCategoryUseCaseParams';
import { InvalidCategoryException } from './exceptions/InvalidCategoryException';
import { GetRecommendedRoutinesByCategoryUseCase } from './GetRecommendedRoutinesByCategoryUseCase';

@Injectable()
export class GetRecommendedRoutinesByCategoryUseCaseImpl
  implements GetRecommendedRoutinesByCategoryUseCase
{
  constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _imageProvider: ImageProvider,
  ) {}

  public async execute({
    category,
    next,
    size,
  }: GetRecommendedRoutinesByCategoryUseCaseParams): GetRecommendedRoutinesByCategoryResponse {
    if (!Object.values(Category).includes(category)) {
      throw new InvalidCategoryException();
    }

    const recommendedRoutines: RecommendedRoutineModel[] =
      await this._recommendRoutineRepository.findAllByCategory(
        category,
        size,
        next,
      );

    const output: GetRecommendedRoutinesByCategoryResponseDto =
      await this._mapModelToResponseDto(recommendedRoutines, size);

    return output;
  }

  private async _mapModelToResponseDto(
    recommendedRoutines: RecommendedRoutineModel[],
    size: number,
  ): Promise<GetRecommendedRoutinesByCategoryResponseDto> {
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

        const howToProveYouDidIt: HowToProveYouDidIt =
          CommonRecommendedRoutineService.getHowToProveByCategory(
            routine['category'],
          );

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
          thumbnail: thumbnailUrl,
          cardnews: cardnewsUrl,
          howToProveScript: howToProveYouDidIt.script,
          howToProveImageUrl: howToProveYouDidIt.imageUrl,
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
