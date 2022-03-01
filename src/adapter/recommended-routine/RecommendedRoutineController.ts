import {
  Body,
  Injectable,
  Param,
  Query,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import { AddRecommendedRoutineUseCase } from '../../domain/use-cases/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineUseCaseParams } from '../../domain/use-cases/recommended-routine/add-recommended-routine/dtos/AddRecommendedRoutineUseCaseParams';
import { ModifyRecommendedRoutineUseCaseParams } from '../../domain/use-cases/recommended-routine/modify-recommended-routine/dtos/ModifyRecommendedRoutineUseCaseParams';
import { ModifyRecommendedRoutineUseCase } from '../../domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import {
  AddRecommendedRoutineResponse,
  DeleteRecommendedRoutineResponse,
  GetRecommendedRoutineResponse,
  GetRecommendedRoutinesResponse,
  ModifyRecommendedRoutineResponse,
  PatchCardnewsResponse,
  PatchThumbnailResponse,
} from '../../domain/use-cases/recommended-routine/response.index';
import {
  ValidateCustomDecorators,
  ValidateMongoObjectId,
} from '../common/validators/ValidateMongoObjectId';
import { AddRecommendedRoutineRequestDto } from './add-recommended-routine/AddRecommendedRoutineRequestDto';
import { ModifyRecommendedRoutineRequestDto } from './modify-recommended-routine/ModifyRecommendedRoutineRequestDto';
import { DeleteRecommendedRoutineUseCaseParams } from '../../domain/use-cases/recommended-routine/delete-recommended-routine/dtos/DeleteRecommendedRoutineUseCaseParams';
import { DeleteRecommendedRoutineUseCase } from '../../domain/use-cases/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { GetRecommendedRoutineUseCaseParams } from '../../domain/use-cases/recommended-routine/get-recommended-routine/dtos/GetRecommendedRoutineUseCaseParams';
import { GetRecommendedRoutineUseCase } from '../../domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCase';
import { GetRecommendedRoutinesUseCaseParams } from '../../domain/use-cases/recommended-routine/get-recommended-routines/dtos/GetRecommendedRoutinesUseCaseParams';
import { GetRecommendedRoutinesUseCase } from '../../domain/use-cases/recommended-routine/get-recommended-routines/GetRecommendedRoutinesUseCase';
import { MulterFile } from '../../domain/types';
import { PatchThumbnailUseCaseParams } from '../../domain/use-cases/recommended-routine/patch-thumbnail/dtos/PatchThumbnailUseCaseParams';
import { PatchCardnewsUseCaseParams } from '../../domain/use-cases/recommended-routine/patch-cardnews/dtos/PatchCardnewsUseCaseParams';
import { PatchThumbnailUseCase } from '../../domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCase';
import { PatchCardnewsUseCase } from '../../domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCase';

@Injectable()
export class RecommendedRoutineController {
  constructor(
    private readonly _addRecommendedRoutineUseCase: AddRecommendedRoutineUseCase,
    private readonly _modifyRecommendedRoutineUseCase: ModifyRecommendedRoutineUseCase,
    private readonly _deleteRecommendedRoutineUseCase: DeleteRecommendedRoutineUseCase,
    private readonly _getRecommendedRoutineUseCase: GetRecommendedRoutineUseCase,
    private readonly _getRecommendedRoutinesUseCase: GetRecommendedRoutinesUseCase,
    private readonly _patchThumbnailUseCase: PatchThumbnailUseCase,
    private readonly _patchCardnewsUseCase: PatchCardnewsUseCase,
  ) {}

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

    const response = await this._deleteRecommendedRoutineUseCase.execute(input);

    return response;
  }

  async getRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
  ): GetRecommendedRoutineResponse {
    const input: GetRecommendedRoutineUseCaseParams = {
      recommendedRoutineId: routineId,
    };

    const response = await this._getRecommendedRoutineUseCase.execute(input);

    return response;
  }

  async getRecommendedRoutines(@Query() query): GetRecommendedRoutinesResponse {
    const input: GetRecommendedRoutinesUseCaseParams = {
      // category: query['category'],
      next: query['next'],
      size: +query['size'],
    };

    const response = await this._getRecommendedRoutinesUseCase.execute(input);

    return response;
  }

  async patchThumbnail(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
    @UploadedFile() thumbnail: MulterFile,
  ): PatchThumbnailResponse {
    const input: PatchThumbnailUseCaseParams = {
      userId: user.id,
      routineId,
      thumbnail,
    };

    const response = await this._patchThumbnailUseCase.execute(input);

    return response;
  }

  async patchCardnews(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
    @UploadedFiles() cardnews: MulterFile[],
  ): PatchCardnewsResponse {
    const input: PatchCardnewsUseCaseParams = {
      userId: user.id,
      routineId,
      cardnews,
    };

    const response = await this._patchCardnewsUseCase.execute(input);

    return response;
  }
}
