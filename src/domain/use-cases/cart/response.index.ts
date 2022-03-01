import { GetCartsResponseDto } from './get-carts/dtos/GetCartsResponseDto';

export type GetCartsResponse = Promise<GetCartsResponseDto[] | []>;
export type AddRoutineToCartResponse = Promise<GetCartsResponseDto>;
export type DeleteRoutineFromCartResponse = Promise<Record<string, never>>;
