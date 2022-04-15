import { Body, Injectable, Param } from '@nestjs/common';
import { AddRoutineToCartUsecaseParams } from '../../domain/use-cases/cart/add-routine-to-cart/dtos/AddRoutineToCartUsecaseParams';
import { UserAuth, UserPayload } from '../common/decorators/user.decorator';
import { AddRoutineToCartRequestDto } from './add-routine-to-cart/AddRoutineToCartRequestDto';
import { GetCartsUseCase } from '../../domain/use-cases/cart/get-carts/GetCartsUseCase';
import { GetCartsUsecaseParams } from '../../domain/use-cases/cart/get-carts/dtos/GetCartsUsecaseParams';
import {
  AddRoutineToCartResponse,
  DeleteRoutineFromCartResponse,
  GetCartsResponse,
} from '../../domain/use-cases/cart/response.index';
import { DeleteRoutineFromCartUsecaseParams } from '../../domain/use-cases/cart/delete-routine-from-cart/dtos/DeleteRoutineFromCartUsecaseParams';
import { DeleteRoutineFromCartUseCase } from '../../domain/use-cases/cart/delete-routine-from-cart/DeleteRoutineFromCartUseCase';
import { AddRoutineToCartUseCase } from '../../domain/use-cases/cart/add-routine-to-cart/AddRoutineToCartUseCase';
import { ValidateMongoObjectId } from '../common/validators/ValidateMongoObjectId';
import { GetCartsResponseDto } from '../../domain/use-cases/cart/get-carts/dtos/GetCartsResponseDto';
import { AddRoutineToCartResponseDto } from '../../domain/use-cases/cart/add-routine-to-cart/dtos/AddRoutineToCartResponseDto';

@Injectable()
export class CartController {
  public constructor(
    private readonly _getCartsUseCase: GetCartsUseCase,
    private readonly _deleteRoutineFromCartUseCase: DeleteRoutineFromCartUseCase,
    private readonly _addRoutineToCartUseCase: AddRoutineToCartUseCase,
  ) {}

  public async addRecommendedRoutineToCart(
    @UserAuth() user: UserPayload,
    @Body() addRoutinesToCartRequest: AddRoutineToCartRequestDto,
  ): AddRoutineToCartResponse {
    const input: AddRoutineToCartUsecaseParams = {
      userId: user.id,
      recommendedRoutineId: addRoutinesToCartRequest.recommendedRoutineId,
    };

    const response: AddRoutineToCartResponseDto =
      await this._addRoutineToCartUseCase.execute(input);

    return response;
  }

  public async getCarts(@UserAuth() user: UserPayload): GetCartsResponse {
    const input: GetCartsUsecaseParams = {
      userId: user.id,
    };

    const result: GetCartsResponseDto[] = await this._getCartsUseCase.execute(
      input,
    );

    return result;
  }

  public async deleteRecommendedRoutineFromCart(
    @Param('id', ValidateMongoObjectId) recommendedRoutineId: string,
  ): DeleteRoutineFromCartResponse {
    const input: DeleteRoutineFromCartUsecaseParams = {
      recommendedRoutineId,
    };

    const response: Record<string, never> =
      await this._deleteRoutineFromCartUseCase.execute(input);

    return response;
  }
}
