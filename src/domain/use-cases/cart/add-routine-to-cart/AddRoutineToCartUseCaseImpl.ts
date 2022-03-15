import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../../../domain/repositories/cart/CartRepository';
import { CreateCartDto } from '../../../../domain/repositories/cart/dtos/CreateCartDto';
import { AddRoutineToCartResponse } from '../response.index';
import { AddRoutineToCartUseCase } from './AddRoutineToCartUseCase';
import { AddRoutineToCartUsecaseParams } from './dtos/AddRoutineToCartUsecaseParams';
import { CartConflictException } from './exceptions/CartConflictException';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { RecommendedRoutineNotFoundException } from '../../recommended-routine/common/exceptions/RecommendedRoutineNotFoundException';
import { RecommendedRoutineModel } from '../../../models/RecommendedRoutineModel';
import {
  CommonRecommendedRoutineService,
  HowToProveYouDidIt,
} from '../../recommended-routine/common/CommonRecommendedRoutineService';

@Injectable()
export class AddRoutineToCartUseCaseImpl implements AddRoutineToCartUseCase {
  constructor(
    private readonly _cartRepository: CartRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
  ) {}

  public async execute({
    userId,
    recommendedRoutineId,
  }: AddRoutineToCartUsecaseParams): AddRoutineToCartResponse {
    const recommendedRoutine: RecommendedRoutineModel =
      await this._recommendedRoutineRepository.findOne(recommendedRoutineId);

    if (!recommendedRoutine) throw new RecommendedRoutineNotFoundException();

    const existingCart = await this._cartRepository.findOneByRoutineId(
      recommendedRoutineId,
    );

    if (existingCart) throw new CartConflictException();

    const createDto: CreateCartDto = this._paramsToCreateDto(
      recommendedRoutineId,
      userId,
    );

    await this._cartRepository.create(createDto);

    const howToProveYouDidIt: HowToProveYouDidIt =
      CommonRecommendedRoutineService.getHowToProveByCategory(
        recommendedRoutine['category'],
      );

    const mappedResult = this._mapModelToResponseDto(
      recommendedRoutine,
      howToProveYouDidIt.script,
      howToProveYouDidIt.imageUrl,
    );

    return mappedResult;
  }

  private _paramsToCreateDto(
    recommendedRoutineId: string,
    userId: string,
  ): CreateCartDto {
    return {
      recommended_routine_id: recommendedRoutineId,
      user_id: userId,
    };
  }

  private _mapModelToResponseDto(
    recommendedRoutine: RecommendedRoutineModel,
    howToProveScript: string,
    howToProveImageUrl: string,
  ) {
    return {
      id: recommendedRoutine['_id'],
      title: recommendedRoutine['title'],
      category: recommendedRoutine['category'],
      introduction: recommendedRoutine['introduction'],
      fixedFields: recommendedRoutine['fixed_fields'],
      hour: recommendedRoutine['hour'],
      minute: recommendedRoutine['minute'],
      days: recommendedRoutine['days'],
      alarmVideoId: recommendedRoutine['alarm_video_id'],
      contentVideoId: recommendedRoutine['content_video_id'],
      timerDuration: recommendedRoutine['time_duration'],
      price: recommendedRoutine['price'],
      point: recommendedRoutine['point'],
      exp: recommendedRoutine['exp'],
      howToProveScript,
      howToProveImageUrl,
    };
  }
}
