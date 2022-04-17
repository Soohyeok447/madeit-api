import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../../../domain/repositories/cart/CartRepository';
import { Cart } from '../../../entities/Cart';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { ImageProvider } from '../../../providers/ImageProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import {
  RecommendedRoutineUtils,
  HowToProveYouDidIt,
} from '../../recommended-routine/common/RecommendedRoutineUtils';
import { GetCartsResponse } from '../response.index';
import { GetCartsResponseDto } from './dtos/GetCartsResponseDto';
import { GetCartsUsecaseParams } from './dtos/GetCartsUsecaseParams';
import { GetCartsUseCase } from './GetCartsUseCase';

@Injectable()
export class GetCartsUseCaseImpl implements GetCartsUseCase {
  public constructor(
    private readonly _cartRepository: CartRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({ userId }: GetCartsUsecaseParams): GetCartsResponse {
    this._logger.setContext('GetCarts');

    const result: Cart[] = await this._cartRepository.findAll(userId);

    if (!result.length) return [];

    const mappedOutput: GetCartsResponseDto[] = await Promise.all(
      result.map(async (cart) => {
        const recommendedRoutine: RecommendedRoutine =
          await this._recommendedRoutineRepository.findOne(
            cart.recommendedRoutineId,
          );

        const howToProveYouDidIt: HowToProveYouDidIt =
          RecommendedRoutineUtils.getHowToProveByCategory(
            recommendedRoutine.category,
          );

        const thumbnailCDN: string | string[] = recommendedRoutine.thumbnailId
          ? await this._imageProvider.requestImageToCDN(
              recommendedRoutine.thumbnailId,
            )
          : 'no image';

        const cardnewsCDN: string | string[] = recommendedRoutine.cardnewsId
          ? await this._imageProvider.requestImageToCDN(
              recommendedRoutine.cardnewsId,
            )
          : null;

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
          point: recommendedRoutine.point,
          exp: recommendedRoutine.exp,
          thumbnail: thumbnailCDN,
          cardnews: cardnewsCDN,
          howToProveScript: howToProveYouDidIt.script,
          howToProveImageUrl: howToProveYouDidIt.imageUrl,
        };
      }),
    );

    return mappedOutput;
  }
}
