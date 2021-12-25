import { Injectable } from '@nestjs/common';
import { AddRoutinesToCartInput } from 'src/domain/dto/cart/add_routines_to_cart.input';
import { BuyRoutinesInCartInput } from 'src/domain/dto/cart/buy_routines_in_cart.input';
import { DeleteRoutinesFromCartInput } from 'src/domain/dto/cart/delete_routines_from_cart.input';
import { GetCartInput } from 'src/domain/dto/cart/get_cart.input';
import { GetCartOutput } from 'src/domain/dto/cart/get_cart.output';

@Injectable()
export abstract class CartService {
  /**
   * 모든 장바구니 목록을 가져옵니다.
   * cursor based pagination
   */
  public abstract getCart({
    userId
  }: GetCartInput): Promise<GetCartOutput>;

  /**
   * 루틴을 장바구니에 담기
   */
  public abstract addRoutinesToCart ({
    userId,
    routines
  }: AddRoutinesToCartInput): Promise<void>;

  /**
   * 장바구니에서 루틴 제거
   */
  public abstract deleteRoutinesFromCart ({
    userId,
    routineIds
  }: DeleteRoutinesFromCartInput): Promise<void>;

  /**
   * 장바구니에서 루틴 구매
   */
  public abstract buyRoutinesInCart ({
    userId,
    routineIds
  }: BuyRoutinesInCartInput): Promise<void>;

  /**
   * 유료루틴 결제
   * 이건 좀 알아보고 다시
   */
  // public abstarct payForPaidRoutines ({});
}
