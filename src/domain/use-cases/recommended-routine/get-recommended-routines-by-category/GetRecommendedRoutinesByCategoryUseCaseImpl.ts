import { Injectable } from '@nestjs/common';
import { Category } from '../../../common/enums/Category';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { ImageProvider } from '../../../providers/ImageProvider';
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
  constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
  ) {}

  public async execute({
    category,
    next,
    size,
  }: GetRecommendedRoutinesByCategoryUseCaseParams): GetRecommendedRoutinesByCategoryResponse {
    if (!Object.values(Category).includes(category)) {
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

    const hasMore = recommendedRoutines.length < size ? false : true;

    const nextCursor = hasMore
      ? recommendedRoutines[recommendedRoutines.length - 1]['_id']
      : null;

    const mappedItems: CommonRecommendedRoutineResponseDto[] =
      await Promise.all(
        recommendedRoutines.map(async (recommendedRoutine) => {
          const thumbnail = await this._imageRepository.findOne(
            recommendedRoutine.thumbnailId,
          );

          const thumbnailCDN = recommendedRoutine.thumbnailId
            ? await this._imageProvider.requestImageToCDN(thumbnail)
            : 'no image';

          const cardNews = await this._imageRepository.findOne(
            recommendedRoutine.cardnewsId,
          );

          const cardNewsCDN = recommendedRoutine.cardnewsId
            ? await this._imageProvider.requestImageToCDN(cardNews)
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
