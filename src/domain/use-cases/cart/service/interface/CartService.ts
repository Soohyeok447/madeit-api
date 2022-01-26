import { Injectable } from '@nestjs/common';
import { DeleteRoutineFromCartUsecaseDto } from '../../use-cases/delete-routine-from-cart/dtos/DeleteRoutineFromCartUsecaseDto';
import { GetCartsUsecaseDto } from '../../use-cases/get-carts/dtos/GetCartsUsecaseDto';
import { GetCartsResponseDto } from '../../use-cases/get-carts/dtos/GetCartsResponseDto';
import { AddRoutineToCartUsecaseDto } from '../../use-cases/add-routine-to-cart/dtos/AddRoutineToCartUsecaseDto';

@Injectable()
export abstract class CartService {
  /**
   * 모든 장바구니 목록을 가져옵니다.
   * cursor based pagination
   */
  public abstract getCarts({
    userId,
  }: GetCartsUsecaseDto): Promise<GetCartsResponseDto[]>;

  /**
   * 루틴을 장바구니에 담기
   *
   * 만약 장바구니에 없는 루틴이면 새로 추가한다.
   *
   * 이미 장바구니에 있는 루틴이면 exception처리
   *
   * [amount 속성이 존재하는 경우]
   *
   * 만약 amount가 음수로 들어오면
   * 장바구니 개수가 1이상인지 확인 후
   * 장바구니 개수를 줄여야함
   *
   * 만약 장바구니 수량이 1개인데 줄일려고하면
   * exception 처리
   */
  public abstract addRoutineToCart({
    userId,
    routineId,
  }: AddRoutineToCartUsecaseDto): Promise<void>;

  /**
   * 장바구니에서 루틴 제거
   */
  public abstract deleteRoutineFromCart({
    cartId,
  }: DeleteRoutineFromCartUsecaseDto): Promise<void>;
}
