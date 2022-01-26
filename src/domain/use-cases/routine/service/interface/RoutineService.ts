import { Injectable } from '@nestjs/common';
import { AddRoutineResponseDto } from '../../use-cases/add-routine/dtos/AddRoutineResponseDto';
import { BuyRoutineUsecaseDto } from '../../use-cases/buy-routine/dtos/BuyRoutineUsecaseDto';
import { GetAllRoutinesByCategoryUsecaseDto } from '../../use-cases/get-all-routines-by-category/dtos/GetAllRoutinesByCategoryUsecaseDto';
import { GetAllRoutinesByCategoryResponseDto } from '../../use-cases/get-all-routines-by-category/dtos/GetAllRoutinesByCategoryResponseDto';
import { GetAllRoutinesUsecaseDto } from '../../use-cases/get-all-routines/dtos/GetAllRoutinesUsecaseDto';
import { GetAllRoutinesResponseDto } from '../../use-cases/get-all-routines/dtos/GetAllRoutinesResponseDto';
import { GetRoutineDetailUsecaseDto } from '../../use-cases/get-routine-detail/dtos/GetRoutineDetailUsecaseDto';
import { GetRoutineDetailResponseDto } from '../../use-cases/get-routine-detail/dtos/GetRoutineDetailResponseDto';
import { ModifyRoutineUsecaseDto } from '../../use-cases/modify-routine/dtos/ModifyRoutineUsecaseDto';
import { ModifyRoutineResponseDto } from '../../use-cases/modify-routine/dtos/ModifyRoutineResponseDto';
import { AddRoutineUsecaseDto } from '../../use-cases/add-routine/dtos/AddRoutineUsecaseDto';

@Injectable()
export abstract class RoutineService {
  /**
   * 모든 루틴목록을 가져옴
   * cursor based pagination
   */
  public abstract getAllRoutines({
    next,
    size,
    resolution,
  }: GetAllRoutinesUsecaseDto): Promise<GetAllRoutinesResponseDto>;

  /**
   * 카테고리를 키값으로 모든 루틴목록을 가져옴
   * cursor based pagination
   */
  public abstract getAllRoutinesByCategory({
    next,
    size,
    category,
    resolution,
  }: GetAllRoutinesByCategoryUsecaseDto): Promise<GetAllRoutinesByCategoryResponseDto>;

  /**
   * 루틴 상세정보를 가져옴
   */
  public abstract getRoutineDetail({
    routineId,
    resolution,
  }: GetRoutineDetailUsecaseDto): Promise<GetRoutineDetailResponseDto>;

  /**
   * 루틴 추가
   * admin Role필요
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
  }: AddRoutineUsecaseDto): Promise<AddRoutineResponseDto>;

  /**
   * 루틴 수정
   * admin Role필요
   */
  public abstract modifyRoutine({
    userId,
    routineId,
    name,
    type,
    category,
    introductionScript,
    motivation,
    price,
    relatedProducts,
    cardnews,
    thumbnail,
  }: ModifyRoutineUsecaseDto): Promise<ModifyRoutineResponseDto>;

  /**
   * 루틴 구매
   */
  public abstract buyRoutine({
    userId,
    routineId,
  }: BuyRoutineUsecaseDto): Promise<void>;
}
