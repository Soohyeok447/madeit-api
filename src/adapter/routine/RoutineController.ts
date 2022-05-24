import { Body, Injectable, Param } from '@nestjs/common';
import { AddRoutineUsecaseParams } from '../../domain/use-cases/routine/add-routine/dtos/AddRoutineUsecaseParams';
import { UserAuth, UserPayload } from '../common/decorators/user.decorator';
import { AddRoutineRequestDto } from './add-routine/AddRoutineRequestDto';
import { ModifyRoutineRequestDto } from './modify-routine/ModifyRoutineRequestDto';
import {
  ActivateRoutineResponse,
  GetRoutineResponse,
  GetRoutinesResponse,
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
import { AddRoutineResponseDto } from '../../domain/use-cases/routine/add-routine/dtos/AddRoutineResponseDto';
import { ModifyRoutineResponseDto } from '../../domain/use-cases/routine/modify-routine/dtos/ModifyRoutineResponseDto';
import { GetRoutineResponseDto } from '../../domain/use-cases/routine/get-routine/dtos/GetRoutineResponseDto';
import { GetRoutinesResponseDto } from '../../domain/use-cases/routine/get-routines/dtos/GetRoutinesResponseDto';
import { ActivateRoutineResponseDto } from '../../domain/use-cases/routine/activate-routine/dtos/ActivateRoutineResponseDto';
import { InactivateRoutineResponseDto } from '../../domain/use-cases/routine/inactivate-routine/dtos/InactivateRoutineUseCaseResponseDto';
import { DeleteRoutineResponseDto } from '../../domain/use-cases/routine/delete-routine/dtos/DeleteRoutineResponseDto';

@Injectable()
export class RoutineController {
  public constructor(
    private readonly _addRoutineUseCase: AddRoutineUseCase,
    private readonly _modifyRoutineUseCase: ModifyRoutineUseCase,
    private readonly _getRoutineUseCase: GetRoutineUseCase,
    private readonly _getRoutinesUseCase: GetRoutinesUseCase,
    private readonly _deleteRoutineUseCase: DeleteRoutineUseCase,
    private readonly _activateRoutineUseCase: ActivateRoutineUseCase,
    private readonly _unactivateRoutineUseCase: InactivateRoutineUseCase,
    private readonly _doneRoutineUseCase: DoneRoutineUseCase,
  ) {}

  public async addRoutine(
    @UserAuth() user: UserPayload,
    @Body() addRoutineRequest: AddRoutineRequestDto,
  ): Promise<AddRoutineResponseDto> {
    const input: AddRoutineUsecaseParams = {
      userId: user.id,
      ...addRoutineRequest,
    };

    const response: AddRoutineResponseDto =
      await this._addRoutineUseCase.execute(input);

    return response;
  }

  public async modifyRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
    @Body() modifyRoutineRequest: ModifyRoutineRequestDto,
  ): Promise<ModifyRoutineResponseDto> {
    const input: ModifyRoutineUsecaseParams = {
      userId: user.id,
      routineId,
      ...modifyRoutineRequest,
    };

    const response: ModifyRoutineResponseDto =
      await this._modifyRoutineUseCase.execute(input);

    return response;
  }

  public async getRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
  ): GetRoutineResponse {
    const input: GetRoutineUsecaseParams = {
      routineId,
    };

    const response: GetRoutineResponseDto =
      await this._getRoutineUseCase.execute(input);

    return response;
  }

  public async getRoutines(
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
  ): GetRoutinesResponse {
    const input: GetRoutinesUsecaseParams = {
      userId: user.id,
    };

    const response: GetRoutinesResponseDto[] =
      await this._getRoutinesUseCase.execute(input);

    return response;
  }

  public async activateRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
  ): ActivateRoutineResponse {
    const input: ActivateRoutineUseCaseParams = {
      userId: user.id,
      routineId: routineId,
    };

    const response: ActivateRoutineResponseDto =
      await this._activateRoutineUseCase.execute(input);

    return response;
  }

  public async inactivateRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
  ): InactivateRoutineResponse {
    const input: InactivateRoutineUseCaseParams = {
      userId: user.id,
      routineId: routineId,
    };

    const response: InactivateRoutineResponseDto =
      await this._unactivateRoutineUseCase.execute(input);

    return response;
  }

  public async deleteRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
  ): Promise<DeleteRoutineResponseDto> {
    const input: DeleteRoutineUseCaseParams = {
      routineId,
    };

    const response: any = await this._deleteRoutineUseCase.execute(input);

    return response;
  }

  public async doneRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
  ): DoneRoutineResponse {
    const input: DoneRoutineUseCaseParams = {
      routineId,
      userId: user.id,
    };

    const response: Record<string, never> =
      await this._doneRoutineUseCase.execute(input);

    return response;
  }
}
