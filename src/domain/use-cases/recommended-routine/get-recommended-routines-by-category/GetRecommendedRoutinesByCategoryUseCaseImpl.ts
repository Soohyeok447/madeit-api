import { Injectable } from '@nestjs/common';
import { Category } from '../../../common/enums/Category';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { ImageProvider } from '../../../providers/ImageProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { CommonRecommendedRoutineResponseDto } from '../common/CommonRecommendedRoutineResponseDto';
import {
  RecommendedRoutineUtils,
  HowToProveYouDidIt,
} from '../common/RecommendedRoutineUtils';
import { GetRecommendedRoutinesByCategoryResponse } from '../response.index';
import { GetRecommendedRoutinesByCategoryUseCaseParams } from './dtos/GetRecommendedRoutinesByCategoryUseCaseParams';
import { InvalidCategoryException } from './exceptions/InvalidCategoryException';
import { GetRecommendedRoutinesByCategoryUseCase } from './GetRecommendedRoutinesByCategoryUseCase';

@Injectable()
export class GetRecommendedRoutinesByCategoryUseCaseImpl
  implements GetRecommendedRoutinesByCategoryUseCase
{
  public constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    category,
    next,
    size,
  }: GetRecommendedRoutinesByCategoryUseCaseParams): GetRecommendedRoutinesByCategoryResponse {
    this._logger.setContext('GetRecommendedRoutinesByCategory');

    if (!Object.values(Category).includes(category)) {
      this._logger.error(`유효하지 않은 카테고리 호출. 카테고리 - ${category}`);

      throw new InvalidCategoryException();
    }

    const recommendedRoutines: RecommendedRoutine[] =
      await this._recommendRoutineRepository.findAllByCategory(
        category,
        size,
        next,
      );

    if (!recommendedRoutines.length) {
      return {
        hasMore: false,
        nextCursor: null,
        items: [],
      };
    }

    const hasMore: boolean = recommendedRoutines.length < size ? false : true;

    const nextCursor: string = hasMore
      ? recommendedRoutines[recommendedRoutines.length - 1].id
      : null;

    const mappedItems: CommonRecommendedRoutineResponseDto[] =
      await Promise.all(
        recommendedRoutines.map(async (recommendedRoutine) => {
          const thumbnailCDN: string | string[] = recommendedRoutine.thumbnailId
            ? await this._imageProvider.requestImageToCDN(
                recommendedRoutine.thumbnailId,
              )
            : 'no image';

          const cardNewsCDN: string | string[] = recommendedRoutine.cardnewsId
            ? await this._imageProvider.requestImageToCDN(
                recommendedRoutine.cardnewsId,
              )
            : null;

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
            cardnews: cardNewsCDN as string[],
            thumbnail: thumbnailCDN as string,
            point: recommendedRoutine.point,
            exp: recommendedRoutine.exp,
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
