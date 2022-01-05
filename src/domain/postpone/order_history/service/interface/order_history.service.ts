import { Injectable } from '@nestjs/common';
import { DeleteRoutineFromOrderHistoryInput } from 'src/domain/postpone/order_history/dtos/delete_routine_from_order_history.input';
import { GetOrderHistoryInput } from '../../dtos/get_order_history.input';
import { GetOrderHistoryOutput } from '../../dtos/get_order_history.output';

@Injectable()
export abstract class OrderHistoryService {
  /**
   * 모든 유료루틴 구매 목록을 가져옴
   * cursor based pagination
   */
  public abstract getOrderHistory({
    userId,
  }: GetOrderHistoryInput): Promise<GetOrderHistoryOutput>;

  /**
   * 유료루틴 구매내역 개별 삭제
   */
  public abstract deleteRoutineFromOrderHistory({
    userId,
    routineId,
  }: DeleteRoutineFromOrderHistoryInput): Promise<void>;
}