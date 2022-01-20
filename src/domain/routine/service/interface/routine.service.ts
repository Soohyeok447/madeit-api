import { Injectable } from '@nestjs/common';
import { AddRoutineInput } from 'src/domain/routine/use-cases/add-routine/dtos/add_routine.input';
import { AddRoutineOutput } from '../../use-cases/add-routine/dtos/add_routine.output';
import { BuyRoutineInput } from '../../use-cases/buy-routine/dtos/buy_routine.input';
import { GetAllRoutinesByCategoryInput } from '../../use-cases/get-all-routines-by-category/dtos/get_all_routines_by_category.input';
import { GetAllRoutinesByCategoryOutput } from '../../use-cases/get-all-routines-by-category/dtos/get_all_routines_by_category.output';
import { GetAllRoutinesInput } from '../../use-cases/get-all-routines/dtos/get_all_routines.input';
import { GetAllRoutinesOutput } from '../../use-cases/get-all-routines/dtos/get_all_routines.output';
import { GetRoutineDetailInput } from '../../use-cases/get-routine-detail/dtos/get_routine_detail.input';
import { GetRoutineDetailOutput } from '../../use-cases/get-routine-detail/dtos/get_routine_detail.output';

@Injectable()
export abstract class RoutineService {
  /**
   * 모든 루틴목록을 가져옴
   * cursor based pagination
   */
  public abstract getAllRoutines({
    next,
    size,
    resolution
  }: GetAllRoutinesInput): Promise<GetAllRoutinesOutput>;

   /**
   * 카테고리를 키값으로 모든 루틴목록을 가져옴
   * cursor based pagination
   */
    public abstract getAllRoutinesByCategory({
      next,
      size,
      category,
      resolution
    }: GetAllRoutinesByCategoryInput): Promise<GetAllRoutinesByCategoryOutput>;

  /**
   * 루틴 상세정보를 가져옴
   */
  public abstract getRoutineDetail({
    routineId,
    resolution
  }: GetRoutineDetailInput): Promise<GetRoutineDetailOutput>;

  /**
   * 루틴 추가
   * admin Role, secret필요
   * dev 서버에서만 사용가능하게 하는 방법도 있음
   */
  public abstract addRoutine({
    userId,
    name,
    type,
    category,
    introductionScript,
    motivation,
    price,
    relatedProducts,
    cardnews,
    thumbnail,
  }: AddRoutineInput): Promise<AddRoutineOutput>;

  /**
   * 루틴 구매
   */
  public abstract buyRoutine({
    userId,
    routineId,
  }: BuyRoutineInput): Promise<void>;
}
