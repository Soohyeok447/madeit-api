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
import { CartConflictException } from '../use-cases/add-routine-to-cart/exceptions/cart_conflict.exception';
import { InvalidObjectIdException } from 'src/domain/common/exceptions/invalid_object_id.exception';
import { RoutineRepository } from 'src/domain/routine/routine.repsotiroy';
import { CartNotFoundException } from '../common/exceptions/cart_not_found.exception';
import { RoutineNotFoundException } from 'src/domain/common/exceptions/routine_not_found.exception';

@Injectable()
export class CartServiceImpl implements CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly routineRepository: RoutineRepository
    ) {}

  public async getCarts({ userId }: GetCartsInput): Promise<GetCartsOutput[]> {
    const result = await this.cartRepository.findAll(userId);

    if(!result){
      throw new CartNotFoundException();
    }

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
    if (routineId.length !== 24) {
      throw new InvalidObjectIdException('유효하지 않은 ObjectId');
    }

    const routine = await this.routineRepository.findOne(routineId);
    
    if(!routine){
      throw new RoutineNotFoundException();
    }

    const createDto: CreateCartDto = {
      routineId,
      userId
    };

    const carts = await this.cartRepository.findAll(userId);

    const assertResult = carts.find(e => e['routine_id']['_id'] == routineId);

    if(assertResult){
      throw new CartConflictException();
    }
    
    await this.cartRepository.create(createDto);
  }

  public async deleteRoutineFromCart({
    cartId,
  }: DeleteRoutineFromCartInput): Promise<void> {
    const result = await this.cartRepository.findOne(cartId);

    if(!result){
      throw new CartNotFoundException();
    }

    await this.cartRepository.delete(cartId);
  }
}
