import { Injectable } from '@nestjs/common';

import { AddRoutineToCartUsecaseParams } from '../../add-routine-to-cart/dtos/AddRoutineToCartUsecaseParams';

@Injectable()
export abstract class CartService {}
