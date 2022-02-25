import {
  Body,
  Injectable,
  Param,
} from '@nestjs/common';
import { AddRoutineUsecaseParams } from '../../domain/use-cases/routine/add-routine/dtos/AddRoutineUsecaseParams';
import { User } from '../common/decorators/user.decorator';
import { AddRoutineRequestDto } from './add-routine/AddRoutineRequestDto';
import { ModifyRoutineRequestDto } from './modify-routine/ModifyRoutineRequestDto';
import {
  AddRoutineResponse,
  GetRoutineResponse,
  GetRoutinesResponse,
  ModifyRoutineResponse,
  ToggleActivationResponse,
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
import { ToggleActivationUsecaseParams } from '../../domain/use-cases/routine/toggle-activation/dtos/ToggleActivationUseCaseParams';
import { ToggleActivationUseCase } from '../../domain/use-cases/routine/toggle-activation/ToggleActivationUseCase';

@Injectable()
export class RoutineController {
  constructor(
    private readonly _addRoutineUseCase: AddRoutineUseCase,
    private readonly _modifyRoutineUseCase: ModifyRoutineUseCase,
    private readonly _getRoutineUseCase: GetRoutineUseCase,
    private readonly _getRoutinesUseCase: GetRoutinesUseCase,
    private readonly _toggleActivationUseCase: ToggleActivationUseCase,
  ) { }

  async addRoutine(
    @User() user,
    @Body() addRoutineRequest: AddRoutineRequestDto,
  ): AddRoutineResponse {
    const input: AddRoutineUsecaseParams = {
      userId: user.id,
      ...addRoutineRequest
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

  async getRoutines(
    @User(ValidateCustomDecorators) user,
  ): GetRoutinesResponse {
    const input: GetRoutinesUsecaseParams = {
      userId: user.id,
    };

    const response = await this._getRoutinesUseCase.execute(input);

    return response;
  }

  async toggleActivation(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
  ): ToggleActivationResponse {
    const input: ToggleActivationUsecaseParams = {
      userId: user.id,
      routineId: routineId
    };

    await this._toggleActivationUseCase.execute(input);
  }
}
