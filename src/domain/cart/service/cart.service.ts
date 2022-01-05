import { Injectable } from '@nestjs/common';
import { AddRoutineToCartInput } from '../use-cases/add-routine-to-cart/dtos/add_routines_to_cart.input';

import { WrongCartRequestException } from '../common/exceptions/wrong_cart_request.exception';
import { UserNotFoundException } from '../../common/exceptions/user_not_found.exception';
import { UpdateCartDto } from '../common/dtos/update.dto';
import { UserRepository } from '../../users/users.repository';
import { CartService } from './interface/cart.service';
import { DeleteRoutineFromCartInput } from '../use-cases/delete-routine-from-cart/dtos/delete_routines_from_cart.input';
import { GetCartOutput } from '../use-cases/get-cart/dtos/get_cart.output';
import { GetCartInput } from '../use-cases/get-cart/dtos/get_cart.input';

@Injectable()
export class CartServiceImpl implements CartService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getCart({ userId }: GetCartInput): Promise<GetCartOutput> {
    const result = await this.userRepository.findCartById(userId);

    const output: GetCartOutput = {
      shoppingCart: result['shopping_cart'],
    };

    return output;
  }

  public async addRoutineToCart({
    userId,
    routineId,
  }: AddRoutineToCartInput): Promise<void> {
    const updateData: UpdateCartDto = {
      routineId,
    };

    try {
      await this.userRepository.updateCart(userId, updateData, 'add');
    } catch (err) {
      if (err == 'conflict') {
        throw new WrongCartRequestException(`이미 장바구니에 존재`);
      }
      if (err == 'userNotFound') {
        throw new UserNotFoundException();
      }
    }
  }

  public async deleteRoutineFromCart({
    userId,
    routineId,
  }: DeleteRoutineFromCartInput): Promise<void> {
    const updateData: UpdateCartDto = {
      routineId,
    };

    try {
      await this.userRepository.updateCart(userId, updateData, 'delete');
    } catch (err) {
      if (err == 'noRoutineInCart') {
        throw new WrongCartRequestException('장바구니에 해당 루틴이 없음');
      }
      if (err == 'userNotFound') {
        throw new UserNotFoundException();
      }
    }
  }
}
