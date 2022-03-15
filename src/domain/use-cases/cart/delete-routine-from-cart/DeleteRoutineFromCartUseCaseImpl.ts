import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../../../domain/repositories/cart/CartRepository';
import { CartNotFoundException } from '../common/exceptions/CartNotFoundException';
import { DeleteRoutineFromCartResponse } from '../response.index';
import { DeleteRoutineFromCartUseCase } from './DeleteRoutineFromCartUseCase';
import { DeleteRoutineFromCartUsecaseParams } from './dtos/DeleteRoutineFromCartUsecaseParams';

@Injectable()
export class DeleteRoutineFromCartUseCaseImpl
  implements DeleteRoutineFromCartUseCase
{
  constructor(private readonly _cartRepository: CartRepository) {}

  public async execute({
    recommendedRoutineId,
  }: DeleteRoutineFromCartUsecaseParams): DeleteRoutineFromCartResponse {
    const existingCart = await this._cartRepository.findOneByRoutineId(
      recommendedRoutineId,
    );

    if (!existingCart) {
      throw new CartNotFoundException();
    }

    await this._cartRepository.delete(existingCart['_id']);

    return {};
  }
}
