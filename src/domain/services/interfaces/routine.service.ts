import { Injectable } from '@nestjs/common';
import { AddRoutineInput } from 'src/domain/dto/routine/add_routine.input';
import { AddRoutineOutput } from 'src/domain/dto/routine/add_routine.output';
import { BuyRoutineInput } from 'src/domain/dto/routine/buy_routine.input';
import { GetAllRoutinesOutput } from 'src/domain/dto/routine/get_all_routines.output';
import { GetRoutineDetailInput } from 'src/domain/dto/routine/get_routine_detail.input';
import { GetRoutineDetailOutput } from 'src/domain/dto/routine/get_routine_detail.output';

@Injectable()
export abstract class RoutineService {
  /**
   * 모든 루틴목록을 가져옴
   * cursor based pagination
   */
  public abstract getAllRoutines({

  }): Promise<GetAllRoutinesOutput>;

  /**
   * 루틴 상세정보를 가져옴
   */
  public abstract getRoutineDetail({
    routineId
  }: GetRoutineDetailInput): Promise<GetRoutineDetailOutput>;

  /**
   * 루틴 추가
   * admin Role, secret필요
   */
  public abstract addRoutine({
    userId,
    routine,
    secret
  }: AddRoutineInput): Promise<AddRoutineOutput>;

  /**
   * 루틴 구매
   */
   public abstract buyRoutine ({
    userId,
    routineId
  }: BuyRoutineInput): Promise<void>;

}
