import { GetCartsResponseDto } from './get-carts/dtos/GetCartsResponseDto';

export type GetCartsResponse = Promise<GetCartsResponseDto[] | []>;
export type AddRoutineToCartResponse = Promise<void>;
export type DeleteRoutineFromCartResponse = Promise<void>;
