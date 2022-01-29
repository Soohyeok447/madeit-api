import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../../../domain/repositories/cart/CartRepository';
import { CartNotFoundException } from '../common/exceptions/CartNotFoundException';
import { GetCartsResponse } from '../response.index';
import { GetCartsResponseDto } from './dtos/GetCartsResponseDto';
import { GetCartsUsecaseParams } from './dtos/GetCartsUsecaseParams';
import { GetCartsUseCase } from './GetCartsUseCase';

@Injectable()
export class GetCartsUseCaseImpl implements GetCartsUseCase {
  constructor(private readonly _cartRepository: CartRepository) {}

  public async execute({ userId }: GetCartsUsecaseParams): GetCartsResponse {
    const result = await this._cartRepository.findAll(userId);

    if (!result) {
      throw new CartNotFoundException();
    }

    const mappedOutput: GetCartsResponseDto[] = result.map((cart) => {
      return {
        routineId: cart['routine_id']['_id'],
        routineName: cart['routine_id']['name'],
        cartId: cart['_id'],
      };
    });

    return mappedOutput;
  }
}
