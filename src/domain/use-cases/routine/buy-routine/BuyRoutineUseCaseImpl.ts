import { Injectable } from '@nestjs/common';
import { UseCase } from '../../UseCase';
import { BuyRoutineResponse } from '../response.index';
import { BuyRoutineUseCase } from './BuyRoutineUseCase';
import { BuyRoutineUsecaseParams } from './dtos/BuyRoutineUsecaseParams';

@Injectable()
export class BuyRoutineUseCaseImpl implements BuyRoutineUseCase
{
  constructor() {}

  public async execute({
    userId,
    routineId,
  }: BuyRoutineUsecaseParams): BuyRoutineResponse {
    //TODO 유료인 경우
    //TODO 무료인 경우

    return;
  }
}
