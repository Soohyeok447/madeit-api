import {
  Body,
  Injectable,
  Param,
} from '@nestjs/common';
import { AddRecommendedRoutineUseCase } from '../../domain/use-cases/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineUseCaseParams } from '../../domain/use-cases/recommended-routine/add-recommended-routine/dtos/AddRecommendedRoutineUseCaseParams';
import { AddRecommendedRoutineResponse } from '../../domain/use-cases/recommended-routine/response.index';
import { User } from '../common/decorators/user.decorator';
import { AddRecommendedRoutineRequestDto } from './add-recommended-routine/AddRecommendedRoutineRequestDto';

@Injectable()
export class RecommendedRoutineController {
  constructor(
    private readonly _addRecommendedRoutineUseCase: AddRecommendedRoutineUseCase,
  
  ) { }

  async addRecommendedRoutine(
    @User() user,
    @Body() addRecommendedRoutineRequest: AddRecommendedRoutineRequestDto,
  ): AddRecommendedRoutineResponse {
    const input: AddRecommendedRoutineUseCaseParams = {
      userId: user.id,
      ...addRecommendedRoutineRequest,
    };

    const response = await this._addRecommendedRoutineUseCase.execute(input);

    return response;
  }

  // async modifyRoutine(
  //   @Param('id', ValidateMongoObjectId) routineId: string,
  //   @User(ValidateCustomDecorators) user,
  //   @Body() modifyRoutineRequest: ModifyRoutineRequestDto,
  // ): ModifyRoutineResponse {
  //   const input: ModifyRoutineUsecaseParams = {
  //     userId: user.id,
  //     routineId,
  //     ...modifyRoutineRequest,
  //   };

  //   const response = await this._modifyRoutineUseCase.execute(input);

  //   return response;
  // }

  // async getRoutine(
  //   @Param('id', ValidateMongoObjectId) routineId: string,
  // ): GetRoutineResponse {
  //   const input: GetRoutineUsecaseParams = {
  //     routineId,
  //   };

  //   const response = await this._getRoutineUseCase.execute(input);

  //   return response;
  // }

  // async getRoutines(
  //   @User(ValidateCustomDecorators) user,
  // ): GetRoutinesResponse {
  //   const input: GetRoutinesUsecaseParams = {
  //     userId: user.id,
  //   };

  //   const response = await this._getRoutinesUseCase.execute(input);

  //   return response;
  // }

}
