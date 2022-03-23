import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../../../domain/repositories/cart/CartRepository';
import { ImageProvider } from '../../../providers/ImageProvider';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import {
  CommonRecommendedRoutineService,
  HowToProveYouDidIt,
} from '../../recommended-routine/common/CommonRecommendedRoutineService';
import { GetCartsResponse } from '../response.index';
import { GetCartsResponseDto } from './dtos/GetCartsResponseDto';
import { GetCartsUsecaseParams } from './dtos/GetCartsUsecaseParams';
import { GetCartsUseCase } from './GetCartsUseCase';

@Injectable()
export class GetCartsUseCaseImpl implements GetCartsUseCase {
  constructor(
    private readonly _cartRepository: CartRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
  ) {}

  public async execute({ userId }: GetCartsUsecaseParams): GetCartsResponse {
    const result = await this._cartRepository.findAll(userId);

    if (!result.length) return [];

    const mappedOutput: GetCartsResponseDto[] = await Promise.all(
      result.map(async (cart) => {
        const recommendedRoutine =
          await this._recommendedRoutineRepository.findOne(
            cart.recommendedRoutineId,
          );

        const howToProveYouDidIt: HowToProveYouDidIt =
          CommonRecommendedRoutineService.getHowToProveByCategory(
            recommendedRoutine.category,
          );

        const thumbnail = await this._imageRepository.findOne(
          recommendedRoutine.thumbnailId,
        );

        const thumbnailCDN = recommendedRoutine.thumbnailId
          ? await this._imageProvider.requestImageToCDN(thumbnail)
          : null;

        const cardnews = await this._imageRepository.findOne(
          recommendedRoutine.cardnewsId,
        );

        const cardnewsCDN = recommendedRoutine.cardnewsId
          ? await this._imageProvider.requestImageToCDN(cardnews)
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
