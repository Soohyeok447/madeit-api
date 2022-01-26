import { Injectable } from '@nestjs/common';
import { GetOrderHistoryUsecaseDto } from '../../dtos/GetOrderHistoryUsecaseDto';
import { GetOrderHistoryResponseDto } from '../../dtos/GetOrderHistoryResponseDto';
import { DeleteRoutineFromOrderHistoryUsecaseDto } from '../../dtos/DeleteRoutineFromOrderHistoryUsecaseDto';

@Injectable()
export abstract class OrderHistoryService {
  /**
   * 모든 유료루틴 구매 목록을 가져옴
   * cursor based pagination
   */
  public abstract getOrderHistory({
    userId,
  }: GetOrderHistoryUsecaseDto): Promise<GetOrderHistoryResponseDto>;

  /**
   * 유료루틴 구매내역 개별 삭제
   */
  public abstract deleteRoutineFromOrderHistory({
    userId,
    routineId,
  }: DeleteRoutineFromOrderHistoryUsecaseDto): Promise<void>;
}
