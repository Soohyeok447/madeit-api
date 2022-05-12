import { Injectable, Param, Query } from '@nestjs/common';
import {
  GetRecommendedRoutineResponse,
  GetRecommendedRoutinesByCategoryResponse,
} from '../../domain/use-cases/recommended-routine/response.index';
import { ValidateMongoObjectId } from '../common/validators/ValidateMongoObjectId';
import { GetRecommendedRoutineUseCaseParams } from '../../domain/use-cases/recommended-routine/get-recommended-routine/dtos/GetRecommendedRoutineUseCaseParams';
import { GetRecommendedRoutineUseCase } from '../../domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCase';
import { GetRecommendedRoutinesByCategoryUseCaseParams } from '../../domain/use-cases/recommended-routine/get-recommended-routines-by-category/dtos/GetRecommendedRoutinesByCategoryUseCaseParams';
import { GetRecommendedRoutinesByCategoryUseCase } from '../../domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCase';
import { GetRecommendedRoutineResponseDto } from '../../domain/use-cases/recommended-routine/get-recommended-routine/dtos/GetRecommendedRoutineResponseDto';
import { GetRecommendedRoutinesByCategoryResponseDto } from '../../domain/use-cases/recommended-routine/get-recommended-routines-by-category/dtos/GetRecommendedRoutinesByCategoryResponseDto';

@Injectable()
export class RecommendedRoutineController {
  public constructor(
    private readonly _getRecommendedRoutineUseCase: GetRecommendedRoutineUseCase,
    private readonly _getRecommendedRoutinesUseCase: GetRecommendedRoutinesByCategoryUseCase,
  ) {}

  public async getRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
  ): GetRecommendedRoutineResponse {
    const input: GetRecommendedRoutineUseCaseParams = {
      recommendedRoutineId: routineId,
    };

    const response: GetRecommendedRoutineResponseDto =
      await this._getRecommendedRoutineUseCase.execute(input);

    return response;
  }

  public async getRecommendedRoutinesByCategory(
    @Query() query: any,
  ): GetRecommendedRoutinesByCategoryResponse {
    const input: GetRecommendedRoutinesByCategoryUseCaseParams = {
      category: query['category'],
      next: query['next'],
      size: +query['size'],
    };

    const response: GetRecommendedRoutinesByCategoryResponseDto =
      await this._getRecommendedRoutinesUseCase.execute(input);

    return response;
  }
}
