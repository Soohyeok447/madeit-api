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
import { Cart } from '../../../entities/Cart';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class AddRoutineToCartUseCaseImpl implements AddRoutineToCartUseCase {
  public constructor(
    private readonly _cartRepository: CartRepository,
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
      throw new RecommendedRoutineNotFoundException(
        this._logger.getContext(),
        `미존재 추천루틴 장바구니에 추가 시도.`,
      );
    }

    const existingCart: Cart = await this._cartRepository.findOneByRoutineId(
      recommendedRoutineId,
    );

    if (existingCart) {
      throw new CartConflictException(
        this._logger.getContext(),
        `장바구니에 중복된 추천루틴 추가 시도.`,
      );
    }

    await this._cartRepository.create({
      recommendedRoutineId: recommendedRoutineId,
      userId: userId,
    });

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
      cardnewsUrl: [recommendedRoutine.cardnewsId],
      thumbnailUrl: recommendedRoutine.youtubeThumbnailUrl,
      timerDuration: recommendedRoutine.timerDuration,
      price: recommendedRoutine.price,
      point: recommendedRoutine.point,
      exp: recommendedRoutine.exp,
      howToProveScript: howToProveYouDidIt.script,
      howToProveImageUrl: howToProveYouDidIt.imageUrl,
    };
  }
}
