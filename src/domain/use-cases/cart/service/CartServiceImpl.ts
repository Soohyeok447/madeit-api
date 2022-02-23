import { Injectable } from '@nestjs/common';
import { AddRoutineToCartUsecaseParams } from '../add-routine-to-cart/dtos/AddRoutineToCartUsecaseParams';
import { CartService } from './interface/CartService';
import { CartConflictException } from '../add-routine-to-cart/exceptions/CartConflictException';
import { CartNotFoundException } from '../common/exceptions/CartNotFoundException';
import { CartRepository } from '../../../repositories/cart/CartRepository';
import { RoutineRepository } from '../../../../domain/repositories/routine/RoutineRepository';
import { RoutineNotFoundException } from '../../../common/exceptions/customs/RoutineNotFoundException';
import { CreateCartDto } from '../../../../domain/repositories/cart/dtos/CreateCartDto';
import { CartModel } from '../../../../domain/models/CartModel';
import { RoutineModel } from '../../../../domain/models/RoutineModel';
import {
  AddRoutineToCartResponse,
  DeleteRoutineFromCartResponse,
} from '../response.index';

@Injectable()
export class CartServiceImpl implements CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly routineRepository: RoutineRepository,
  ) {}
}
