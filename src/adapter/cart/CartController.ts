import { Body, Injectable, Param } from '@nestjs/common';
import { CartService } from '../../domain/use-cases/cart/service/interface/CartService';
import { AddRoutineToCartUsecaseParams } from '../../domain/use-cases/cart/add-routine-to-cart/dtos/AddRoutineToCartUsecaseParams';
import { User } from '../common/decorators/user.decorator';
import { AddRoutineToCartRequestDto } from './add-routine-to-cart/AddRoutineToCartRequestDto';
import { GetCartsUseCase } from '../../domain/use-cases/cart/get-carts/GetCartsUseCase';
import { GetCartsUsecaseParams } from '../../domain/use-cases/cart/get-carts/dtos/GetCartsUsecaseParams';
import {
  AddRoutineToCartResponse,
  DeleteRoutineFromCartResponse,
  GetCartsResponse,
} from '../../domain/use-cases/cart/response.index';
import { DeleteRoutineFromCartUsecaseParams } from '../../domain/use-cases/cart/delete-routine-from-cart/dtos/DeleteRoutineFromCartUsecaseParams';
import { DeleteRoutineFromCartUseCase } from 'src/domain/use-cases/cart/delete-routine-from-cart/DeleteRoutineFromCartUseCase';
import { AddRoutineToCartUseCase } from 'src/domain/use-cases/cart/add-routine-to-cart/AddRoutineToCartUseCase';
import { ValidateMongoObjectId } from '../common/validators/ValidateMongoObjectId';

@Injectable()
export class CartController {
  constructor(
    private readonly _getCartsUseCase: GetCartsUseCase,
    private readonly _deleteRoutineFromCartUseCase: DeleteRoutineFromCartUseCase,
    private readonly _addRoutineToCartUseCase: AddRoutineToCartUseCase,
  ) {}

  async addRoutinesToCart(
    @User() user,
    @Body() addRoutinesToCartRequest: AddRoutineToCartRequestDto,
  ): AddRoutineToCartResponse {
    const input: AddRoutineToCartUsecaseParams = {
      userId: user.id,
      routineId: addRoutinesToCartRequest.routineId,
    };

    await this._addRoutineToCartUseCase.execute(input);
  }

  async getCarts(@User() user): GetCartsResponse {
    const input: GetCartsUsecaseParams = {
      userId: user.id,
    };

    const result = await this._getCartsUseCase.execute(input);

    return result;
  }

  async deleteRoutineFromCart(
    @Param('id', ValidateMongoObjectId) cartId: string,
  ): DeleteRoutineFromCartResponse {
    const input: DeleteRoutineFromCartUsecaseParams = {
      cartId,
    };

    await this._deleteRoutineFromCartUseCase.execute(input);
  }
}
