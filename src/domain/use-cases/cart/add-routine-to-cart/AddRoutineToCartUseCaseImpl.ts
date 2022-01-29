import { Injectable } from '@nestjs/common';
import { RoutineNotFoundException } from '../../../../domain/common/exceptions/RoutineNotFoundException';
import { RoutineModel } from '../../../../domain/models/RoutineModel';
import { CartRepository } from '../../../../domain/repositories/cart/CartRepository';
import { CreateCartDto } from '../../../../domain/repositories/cart/dtos/CreateCartDto';
import { RoutineRepository } from '../../../../domain/repositories/routine/RoutineRepository';
import { AddRoutineToCartResponse } from '../response.index';
import { AddRoutineToCartUseCase } from './AddRoutineToCartUseCase';
import { AddRoutineToCartUsecaseParams } from './dtos/AddRoutineToCartUsecaseParams';
import { CartConflictException } from './exceptions/CartConflictException';

@Injectable()
export class AddRoutineToCartUseCaseImpl implements AddRoutineToCartUseCase {
  constructor(
    private readonly _cartRepository: CartRepository,
    private readonly _routineRepository: RoutineRepository,
  ) {}

  public async execute({
    userId,
    routineId,
  }: AddRoutineToCartUsecaseParams): AddRoutineToCartResponse {
    const routine: RoutineModel = await this._routineRepository.findOne(
      routineId,
    );

    if (!routine) {
      throw new RoutineNotFoundException();
    }

    const carts = await this._cartRepository.findAll(userId);

    let assertResult;

    if (carts) {
      assertResult = carts.find((e) => e['routine_id']['_id'] == routineId);
    }

    if (assertResult) {
      throw new CartConflictException();
    }

    const createDto: CreateCartDto = {
      routineId,
      userId,
    };

    await this._cartRepository.create(createDto);
  }
}
