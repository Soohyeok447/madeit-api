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

@Injectable()
export class AddRoutineToCartUseCaseImpl implements AddRoutineToCartUseCase {
  constructor(
    private readonly _cartRepository: CartRepository,
    private readonly _routineRecommendedRepository: RecommendedRoutineRepository,
  ) { }

  public async execute({
    userId,
    routineId,
  }: AddRoutineToCartUsecaseParams): AddRoutineToCartResponse {
    const routine: RecommendedRoutineModel = await this._routineRecommendedRepository.findOne(
      routineId,
    );

    if (!routine) {
      throw new RecommendedRoutineNotFoundException();
    }

    const cart = await this._cartRepository.findOneByRoutineId(routineId);

    if (cart) {
      throw new CartConflictException();
    }

    const createDto: CreateCartDto = {
      routineId,
      userId,
    };

    await this._cartRepository.create(createDto);
  }
}
