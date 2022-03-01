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
    cartId,
  }: DeleteRoutineFromCartUsecaseParams): DeleteRoutineFromCartResponse {
    const result = await this._cartRepository.findOne(cartId);

    if (!result) {
      throw new CartNotFoundException();
    }

    await this._cartRepository.delete(cartId);

    return {};
  }
}
