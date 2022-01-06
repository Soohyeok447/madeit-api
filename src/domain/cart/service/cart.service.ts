import { Injectable } from '@nestjs/common';
import { AddRoutineToCartInput } from '../use-cases/add-routine-to-cart/dtos/add_routines_to_cart.input';

import { WrongCartRequestException } from '../common/exceptions/wrong_cart_request.exception';
import { UserNotFoundException } from '../../common/exceptions/user_not_found.exception';
import { UserRepository } from '../../users/users.repository';
import { CartService } from './interface/cart.service';
import { DeleteRoutineFromCartInput } from '../use-cases/delete-routine-from-cart/dtos/delete_routines_from_cart.input';
import { GetCartsOutput } from '../use-cases/get-carts/dtos/get_carts.output';
import { GetCartsInput } from '../use-cases/get-carts/dtos/get_carts.input';
import { CartRepository } from '../cart.repository';
import { CreateCartDto } from '../common/dtos/create.dto';

@Injectable()
export class CartServiceImpl implements CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  public async getCarts({ userId }: GetCartsInput): Promise<GetCartsOutput[]> {
    const result = await this.cartRepository.findAll(userId);

    const mappedOutput: GetCartsOutput[] = result.map((cart)=>{
      return {
        routineId: cart['routine_id']['_id'],
        name: cart['routine_id']['name']
      }
    })

    return mappedOutput;
  }

  public async addRoutineToCart({
    userId,
    routineId,
  }: AddRoutineToCartInput): Promise<void> {
    const createDto: CreateCartDto = {
      routineId,
      userId
    };

   
    await this.cartRepository.create(createDto);
  }

  public async deleteRoutineFromCart({
    cartId,
  }: DeleteRoutineFromCartInput): Promise<void> {
    await this.cartRepository.delete(cartId);
    
  }
}
