import { Injectable } from '@nestjs/common';
import { Category } from '../../../common/enums/Category';
import { RecommendedRoutineModel } from '../../../models/RecommendedRoutineModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { CommonRecommendedRoutineResponseDto } from '../common/CommonRecommendedRoutineResponseDto';
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

    const mappedItems: CommonRecommendedRoutineResponseDto[] =
      await Promise.all(
        recommendedRoutines.map(async (recommendedRoutine) => {
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

          const howToProveYouDidIt: HowToProveYouDidIt =
            CommonRecommendedRoutineService.getHowToProveByCategory(
              recommendedRoutine['category'],
            );

          return {
            id: recommendedRoutine['_id'],
            title: recommendedRoutine['title'],
            category: recommendedRoutine['category'],
            fixedFields: recommendedRoutine['fixedFields'],
            hour: recommendedRoutine['hour'],
            minute: recommendedRoutine['minute'],
            days: recommendedRoutine['days'],
            alarmVideoId: recommendedRoutine['alarmVideoId'],
            contentVideoId: recommendedRoutine['contentVideoId'],
            timerDuration: recommendedRoutine['timerDuration'],
            price: recommendedRoutine['price'],
            point: recommendedRoutine['point'],
            exp: recommendedRoutine['exp'],
            introduction: recommendedRoutine['introduction'],
            thumbnail: thumbnailCDN as string,
            cardnews: cardNewsCDN as string[],
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
