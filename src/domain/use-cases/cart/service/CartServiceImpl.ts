import { Injectable } from '@nestjs/common';
import { AddRoutineToCartUsecaseDto } from '../use-cases/add-routine-to-cart/dtos/AddRoutineToCartUsecaseDto';
import { CartService } from './interface/CartService';
import { DeleteRoutineFromCartUsecaseDto } from '../use-cases/delete-routine-from-cart/dtos/DeleteRoutineFromCartUsecaseDto';
import { GetCartsResponseDto } from '../use-cases/get-carts/dtos/GetCartsResponseDto';
import { GetCartsUsecaseDto } from '../use-cases/get-carts/dtos/GetCartsUsecaseDto';
import { CartConflictException } from '../use-cases/add-routine-to-cart/exceptions/CartConflictException';
import { CartNotFoundException } from '../common/exceptions/CartNotFoundException';
import { CartRepository } from '../../../repositories/cart/CartRepository';
import { RoutineRepository } from '../../../../domain/repositories/routine/RoutineRepository';
import { RoutineNotFoundException } from '../../../../domain/exception/RoutineNotFoundException';
import { CreateCartDto } from '../../../../domain/repositories/cart/dtos/CreateCartDto';

@Injectable()
export class CartServiceImpl implements CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly routineRepository: RoutineRepository,
  ) {}

  public async getCarts({ userId }: GetCartsUsecaseDto): Promise<GetCartsResponseDto[]> {
    const result = await this.cartRepository.findAll(userId);

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

  public async addRoutineToCart({
    userId,
    routineId,
  }: AddRoutineToCartUsecaseDto): Promise<void> {
    const routine = await this.routineRepository.findOne(routineId);

    if (!routine) {
      throw new RoutineNotFoundException();
    }

    const createDto: CreateCartDto = {
      routineId,
      userId,
    };

    const carts = await this.cartRepository.findAll(userId);

    let assertResult;

    if (carts) {
      assertResult = carts.find((e) => e['routine_id']['_id'] == routineId);
    }

    if (assertResult) {
      throw new CartConflictException();
    }

    await this.cartRepository.create(createDto);
  }

  public async deleteRoutineFromCart({
    cartId,
  }: DeleteRoutineFromCartUsecaseDto): Promise<void> {
    const result = await this.cartRepository.findOne(cartId);

    if (!result) {
      throw new CartNotFoundException();
    }

    await this.cartRepository.delete(cartId);
  }
}
