import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../../../domain/repositories/cart/CartRepository';
import { Cart } from '../../../entities/Cart';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { CartNotFoundException } from '../common/exceptions/CartNotFoundException';
import { DeleteRoutineFromCartResponse } from '../response.index';
import { DeleteRoutineFromCartUseCase } from './DeleteRoutineFromCartUseCase';
import { DeleteRoutineFromCartUsecaseParams } from './dtos/DeleteRoutineFromCartUsecaseParams';

@Injectable()
export class DeleteRoutineFromCartUseCaseImpl
  implements DeleteRoutineFromCartUseCase
{
  public constructor(
    private readonly _cartRepository: CartRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    recommendedRoutineId,
    userId,
  }: DeleteRoutineFromCartUsecaseParams): DeleteRoutineFromCartResponse {
    this._logger.setContext('DeleteRoutineFromCart');

    const existingCart: Cart = await this._cartRepository.findOneByRoutineId(
      recommendedRoutineId,
    );

    if (!existingCart) {
      this._logger.error(
        `장바구니에 없는 추천루틴 삭제 시도. 호출자 id - ${userId}`,
      );
      throw new CartNotFoundException();
    }

    await this._cartRepository.delete(existingCart.id);

    return {};
  }
}
