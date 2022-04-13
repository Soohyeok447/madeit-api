import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../../../domain/repositories/cart/CartRepository';
import { AddRoutineToCartResponse } from '../response.index';
import { AddRoutineToCartUseCase } from './AddRoutineToCartUseCase';
import { AddRoutineToCartUsecaseParams } from './dtos/AddRoutineToCartUsecaseParams';
import { CartConflictException } from './exceptions/CartConflictException';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { RecommendedRoutineNotFoundException } from '../../recommended-routine/common/exceptions/RecommendedRoutineNotFoundException';
import {
  RecommendedRoutineUtils,
  HowToProveYouDidIt,
} from '../../recommended-routine/common/RecommendedRoutineUtils';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { ImageProvider } from '../../../providers/ImageProvider';
import { Cart } from '../../../entities/Cart';
import { ImageModel } from '../../../models/ImageModel';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class AddRoutineToCartUseCaseImpl implements AddRoutineToCartUseCase {
  public constructor(
    private readonly _cartRepository: CartRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    userId,
    recommendedRoutineId,
  }: AddRoutineToCartUsecaseParams): AddRoutineToCartResponse {
    this._logger.setContext('AddRoutineToCart');

    const recommendedRoutine: RecommendedRoutine =
      await this._recommendedRoutineRepository.findOne(recommendedRoutineId);

    if (!recommendedRoutine) {
      this._logger.error(
        `미존재 추천루틴 장바구니에 추가 시도. 호출자 id - ${userId}`,
      );
      throw new RecommendedRoutineNotFoundException();
    }

    const existingCart: Cart = await this._cartRepository.findOneByRoutineId(
      recommendedRoutineId,
    );

    if (existingCart) {
      this._logger.error(
        `장바구니에 중복된 추천루틴 추가 시도. 호출자 id - ${userId}`,
      );
      throw new CartConflictException();
    }

    await this._cartRepository.create({
      recommendedRoutineId: recommendedRoutineId,
      userId: userId,
    });

    const howToProveYouDidIt: HowToProveYouDidIt =
      RecommendedRoutineUtils.getHowToProveByCategory(
        recommendedRoutine.category,
      );

    const thumbnail: ImageModel = await this._imageRepository.findOne(
      recommendedRoutine.thumbnailId,
    );

    const thumbnailCDN: string | string[] = recommendedRoutine.thumbnailId
      ? await this._imageProvider.requestImageToCDN(thumbnail['_id'])
      : 'no image';

    const cardnews: ImageModel = await this._imageRepository.findOne(
      recommendedRoutine.cardnewsId,
    );

    const cardnewsCDN: string | string[] = recommendedRoutine.cardnewsId
      ? await this._imageProvider.requestImageToCDN(cardnews['_id'])
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
      cardnews: cardnewsCDN,
      thumbnail: thumbnailCDN,
      timerDuration: recommendedRoutine.timerDuration,
      price: recommendedRoutine.price,
      point: recommendedRoutine.point,
      exp: recommendedRoutine.exp,
      howToProveScript: howToProveYouDidIt.script,
      howToProveImageUrl: howToProveYouDidIt.imageUrl,
    };
  }
}
