import {
  Body,
  Injectable,
  Param,
} from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import { AddRecommendedRoutineUseCase } from '../../domain/use-cases/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineUseCaseParams } from '../../domain/use-cases/recommended-routine/add-recommended-routine/dtos/AddRecommendedRoutineUseCaseParams';
import { ModifyRecommendedRoutineUseCaseParams } from '../../domain/use-cases/recommended-routine/modify-recommended-routine/dtos/ModifyRecommendedRoutineUseCaseParams';
import { ModifyRecommendedRoutineUseCase } from '../../domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { AddRecommendedRoutineResponse, DeleteRecommendedRoutineResponse, ModifyRecommendedRoutineResponse } from '../../domain/use-cases/recommended-routine/response.index';
import { ValidateCustomDecorators, ValidateMongoObjectId } from '../common/validators/ValidateMongoObjectId';
import { AddRecommendedRoutineRequestDto } from './add-recommended-routine/AddRecommendedRoutineRequestDto';
import { ModifyRecommendedRoutineRequestDto } from './modify-recommended-routine/ModifyRecommendedRoutineRequestDto';
import { DeleteRecommendedRoutineUseCaseParams } from '../../domain/use-cases/recommended-routine/delete-recommended-routine/dtos/DeleteRecommendedRoutineUseCaseParams';
import { DeleteRecommendedRoutineUseCase } from '../../domain/use-cases/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCase';

@Injectable()
export class RecommendedRoutineController {
  constructor(
    private readonly _addRecommendedRoutineUseCase: AddRecommendedRoutineUseCase,
    private readonly _modifyRecommendedRoutineUseCase: ModifyRecommendedRoutineUseCase,
    private readonly _deleteRecommendedRoutineUseCase: DeleteRecommendedRoutineUseCase,

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

  async modifyRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
    @Body() modifyRecommendedRoutineRequest: ModifyRecommendedRoutineRequestDto,
  ): ModifyRecommendedRoutineResponse {
    const input: ModifyRecommendedRoutineUseCaseParams = {
      userId: user.id,
      recommendedRoutineId: routineId,
      ...modifyRecommendedRoutineRequest,
    };

    const response = await this._modifyRecommendedRoutineUseCase.execute(input);

    return response;
  }

  async deleteRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
  ): DeleteRecommendedRoutineResponse {
    const input: DeleteRecommendedRoutineUseCaseParams = {
      userId: user.id,
      recommendedRoutineId: routineId,
    };

    await this._deleteRecommendedRoutineUseCase.execute(input);
  }

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
