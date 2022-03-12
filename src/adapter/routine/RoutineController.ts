import { Body, Injectable, Param } from '@nestjs/common';
import { AddRoutineUsecaseParams } from '../../domain/use-cases/routine/add-routine/dtos/AddRoutineUsecaseParams';
import { User } from '../common/decorators/user.decorator';
import { AddRoutineRequestDto } from './add-routine/AddRoutineRequestDto';
import { ModifyRoutineRequestDto } from './modify-routine/ModifyRoutineRequestDto';
import {
  ActivateRoutineResponse,
  AddRoutineResponse,
  DeleteRoutineResponse,
  GetRoutineResponse,
  GetRoutinesResponse,
  ModifyRoutineResponse,
  InactivateRoutineResponse,
  DoneRoutineResponse,
} from '../../domain/use-cases/routine/response.index';
import { GetRoutineUsecaseParams } from '../../domain/use-cases/routine/get-routine/dtos/GetRoutineUsecaseParams';
import { ModifyRoutineUsecaseParams } from '../../domain/use-cases/routine/modify-routine/dtos/ModifyRoutineUsecaseParams';
import { GetRoutineUseCase } from '../../domain/use-cases/routine/get-routine/GetRoutineUseCase';
import { GetRoutinesUseCase } from '../../domain/use-cases/routine/get-routines/GetRoutinesUseCase';
import { ModifyRoutineUseCase } from '../../domain/use-cases/routine/modify-routine/ModifyRoutineUseCase';
import { AddRoutineUseCase } from '../../domain/use-cases/routine/add-routine/AddRoutineUseCase';
import {
  ValidateCustomDecorators,
  ValidateMongoObjectId,
} from '../common/validators/ValidateMongoObjectId';
import { GetRoutinesUsecaseParams } from '../../domain/use-cases/routine/get-routines/dtos/GetRoutinesUsecaseParams';
import { DeleteRoutineUseCase } from '../../domain/use-cases/routine/delete-routine/DeleteRoutineUseCase';
import { DeleteRoutineUseCaseParams } from '../../domain/use-cases/routine/delete-routine/dtos/DeleteRoutineUseCaseparams';
import { ActivateRoutineUseCase } from '../../domain/use-cases/routine/activate-routine/ActivateRoutineUseCase';
import { InactivateRoutineUseCase } from '../../domain/use-cases/routine/inactivate-routine/InactivateRoutineUseCase';
import { ActivateRoutineUseCaseParams } from '../../domain/use-cases/routine/activate-routine/dtos/ActivateRoutineUseCaseParams';
import { InactivateRoutineUseCaseParams } from '../../domain/use-cases/routine/inactivate-routine/dtos/InactivateRoutineUseCaseParams';
import { DoneRoutineUseCase } from '../../domain/use-cases/routine/done-routine/DoneRoutineUseCase';
import { DoneRoutineUseCaseParams } from '../../domain/use-cases/routine/done-routine/dtos/DoneRoutineUseCaseParams';

@Injectable()
export class RoutineController {
  constructor(
    private readonly _addRoutineUseCase: AddRoutineUseCase,
    private readonly _modifyRoutineUseCase: ModifyRoutineUseCase,
    private readonly _getRoutineUseCase: GetRoutineUseCase,
    private readonly _getRoutinesUseCase: GetRoutinesUseCase,
    private readonly _deleteRoutineUseCase: DeleteRoutineUseCase,
    private readonly _activateRoutineUseCase: ActivateRoutineUseCase,
    private readonly _unactivateRoutineUseCase: InactivateRoutineUseCase,
    private readonly _doneRoutineUseCase: DoneRoutineUseCase,
  ) {}

  async addRoutine(
    @User() user,
    @Body() addRoutineRequest: AddRoutineRequestDto,
  ): AddRoutineResponse {
    const input: AddRoutineUsecaseParams = {
      userId: user.id,
      ...addRoutineRequest,
    };

    const response = await this._addRoutineUseCase.execute(input);

    return response;
  }

  async modifyRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
    @Body() modifyRoutineRequest: ModifyRoutineRequestDto,
  ): ModifyRoutineResponse {
    const input: ModifyRoutineUsecaseParams = {
      userId: user.id,
      routineId,
      ...modifyRoutineRequest,
    };

    const response = await this._modifyRoutineUseCase.execute(input);

    return response;
  }

  async getRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
  ): GetRoutineResponse {
    const input: GetRoutineUsecaseParams = {
      routineId,
    };

    const response = await this._getRoutineUseCase.execute(input);

    return response;
  }

  async getRoutines(@User(ValidateCustomDecorators) user): GetRoutinesResponse {
    const input: GetRoutinesUsecaseParams = {
      userId: user.id,
    };

    const response = await this._getRoutinesUseCase.execute(input);

    return response;
  }

  async activateRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
  ): ActivateRoutineResponse {
    const input: ActivateRoutineUseCaseParams = {
      userId: user.id,
      routineId: routineId,
    };

    const response = await this._activateRoutineUseCase.execute(input);

    return response;
  }

  async inactivateRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
  ): InactivateRoutineResponse {
    const input: InactivateRoutineUseCaseParams = {
      userId: user.id,
      routineId: routineId,
    };

    const response = await this._unactivateRoutineUseCase.execute(input);

    return response;
  }

  async deleteRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
  ): DeleteRoutineResponse {
    const input: DeleteRoutineUseCaseParams = {
      routineId,
    };

    const response = await this._deleteRoutineUseCase.execute(input);

    return response;
  }

  async doneRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
  ): DoneRoutineResponse {
    const input: DoneRoutineUseCaseParams = {
      routineId,
      userId: user.id,
    };

    const response = await this._doneRoutineUseCase.execute(input);

    return response;
  }
}
