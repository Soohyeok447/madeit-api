import { Injectable } from '@nestjs/common';
import { UseCase } from '../../UseCase';
import { BuyRoutineResponse } from '../response.index';
import { BuyRoutineUseCase } from './BuyRoutineUseCase';
import { BuyRoutineUsecaseParams } from './dtos/BuyRoutineUsecaseParams';

@Injectable()
export class BuyRoutineUseCaseImpl implements BuyRoutineUseCase
{
  constructor() {}

  /**
   * 루틴 구매
   */

  /**
       * 유저가 상세페이지 구경 중 -> 구매 버튼을 누름 -> 스케줄을 짜고 확정(저장) 
  -> 0원 or XXXXX원 결제 (0원일 경우 유저에게는 결제 과정은 생략)
      */
  public async execute({
    userId,
    routineId,
  }: BuyRoutineUsecaseParams): BuyRoutineResponse {
    //TODO 유료인 경우
    //TODO 무료인 경우

    return;
  }
}
