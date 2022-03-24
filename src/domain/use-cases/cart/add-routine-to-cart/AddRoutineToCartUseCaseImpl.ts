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

@Injectable()
export class AddRoutineToCartUseCaseImpl implements AddRoutineToCartUseCase {
  constructor(
    private readonly _cartRepository: CartRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
  ) {}

  public async execute({
    userId,
    recommendedRoutineId,
  }: AddRoutineToCartUsecaseParams): AddRoutineToCartResponse {
    const recommendedRoutine: RecommendedRoutine =
      await this._recommendedRoutineRepository.findOne(recommendedRoutineId);

    if (!recommendedRoutine) throw new RecommendedRoutineNotFoundException();

    const existingCart = await this._cartRepository.findOneByRoutineId(
      recommendedRoutineId,
    );

    if (existingCart) throw new CartConflictException();

    await this._cartRepository.create({
      recommendedRoutineId: recommendedRoutineId,
      userId: userId,
    });

    const howToProveYouDidIt: HowToProveYouDidIt =
      RecommendedRoutineUtils.getHowToProveByCategory(
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
