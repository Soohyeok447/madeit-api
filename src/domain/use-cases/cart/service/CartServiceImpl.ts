import { Injectable } from '@nestjs/common';
import { CartService } from './interface/CartService';
import { CartRepository } from '../../../repositories/cart/CartRepository';
import { RoutineRepository } from '../../../../domain/repositories/routine/RoutineRepository';
@Injectable()
export class CartServiceImpl implements CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly routineRepository: RoutineRepository,
  ) {}
}
