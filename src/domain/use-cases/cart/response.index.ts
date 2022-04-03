import { AddRoutineToCartResponseDto } from './add-routine-to-cart/dtos/AddRoutineToCartResponseDto';
import { GetCartsResponseDto } from './get-carts/dtos/GetCartsResponseDto';

export type GetCartsResponse = Promise<GetCartsResponseDto[]>;
export type AddRoutineToCartResponse = Promise<AddRoutineToCartResponseDto>;
export type DeleteRoutineFromCartResponse = Promise<Record<string, never>>;
