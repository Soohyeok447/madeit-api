import {
  Body,
  Injectable,
  Param,
  Query,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UserAuth, UserPayload } from '../common/decorators/user.decorator';
import { AddRecommendedRoutineUseCase } from '../../domain/use-cases/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineUseCaseParams } from '../../domain/use-cases/recommended-routine/add-recommended-routine/dtos/AddRecommendedRoutineUseCaseParams';
import { ModifyRecommendedRoutineUseCaseParams } from '../../domain/use-cases/recommended-routine/modify-recommended-routine/dtos/ModifyRecommendedRoutineUseCaseParams';
import { ModifyRecommendedRoutineUseCase } from '../../domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import {
  AddRecommendedRoutineResponse,
  DeleteRecommendedRoutineResponse,
  GetRecommendedRoutineResponse,
  GetRecommendedRoutinesByCategoryResponse,
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
import { GetRecommendedRoutinesByCategoryUseCaseParams } from '../../domain/use-cases/recommended-routine/get-recommended-routines-by-category/dtos/GetRecommendedRoutinesByCategoryUseCaseParams';
import { GetRecommendedRoutinesByCategoryUseCase } from '../../domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCase';
import { MulterFile } from '../../domain/common/types';
import { PatchThumbnailUseCaseParams } from '../../domain/use-cases/recommended-routine/patch-thumbnail/dtos/PatchThumbnailUseCaseParams';
import { PatchCardnewsUseCaseParams } from '../../domain/use-cases/recommended-routine/patch-cardnews/dtos/PatchCardnewsUseCaseParams';
import { PatchThumbnailUseCase } from '../../domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCase';
import { PatchCardnewsUseCase } from '../../domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCase';
import { AddRecommendedRoutineResponseDto } from '../../domain/use-cases/recommended-routine/add-recommended-routine/dtos/AddRecommendedRoutineResponseDto';
import { ModifyRecommendedRoutineResponseDto } from '../../domain/use-cases/recommended-routine/modify-recommended-routine/dtos/ModifyRecommendedRoutineResponseDto';
import { GetRecommendedRoutineResponseDto } from '../../domain/use-cases/recommended-routine/get-recommended-routine/dtos/GetRecommendedRoutineResponseDto';
import { GetRecommendedRoutinesByCategoryResponseDto } from '../../domain/use-cases/recommended-routine/get-recommended-routines-by-category/dtos/GetRecommendedRoutinesByCategoryResponseDto';

@Injectable()
export class RecommendedRoutineController {
  public constructor(
    private readonly _addRecommendedRoutineUseCase: AddRecommendedRoutineUseCase,
    private readonly _modifyRecommendedRoutineUseCase: ModifyRecommendedRoutineUseCase,
    private readonly _deleteRecommendedRoutineUseCase: DeleteRecommendedRoutineUseCase,
    private readonly _getRecommendedRoutineUseCase: GetRecommendedRoutineUseCase,
    private readonly _getRecommendedRoutinesUseCase: GetRecommendedRoutinesByCategoryUseCase,
    private readonly _patchThumbnailUseCase: PatchThumbnailUseCase,
    private readonly _patchCardnewsUseCase: PatchCardnewsUseCase,
  ) {}

  public async addRecommendedRoutine(
    @UserAuth() user: UserPayload,
    @Body() addRecommendedRoutineRequest: AddRecommendedRoutineRequestDto,
  ): AddRecommendedRoutineResponse {
    const input: AddRecommendedRoutineUseCaseParams = {
      userId: user.id,
      ...addRecommendedRoutineRequest,
    };

    const response: AddRecommendedRoutineResponseDto =
      await this._addRecommendedRoutineUseCase.execute(input);

    return response;
  }

  public async modifyRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
    @Body() modifyRecommendedRoutineRequest: ModifyRecommendedRoutineRequestDto,
  ): ModifyRecommendedRoutineResponse {
    const input: ModifyRecommendedRoutineUseCaseParams = {
      userId: user.id,
      recommendedRoutineId: routineId,
      ...modifyRecommendedRoutineRequest,
    };

    const response: ModifyRecommendedRoutineResponseDto =
      await this._modifyRecommendedRoutineUseCase.execute(input);

    return response;
  }

  public async deleteRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
  ): DeleteRecommendedRoutineResponse {
    const input: DeleteRecommendedRoutineUseCaseParams = {
      userId: user.id,
      recommendedRoutineId: routineId,
    };

    const response: Record<string, never> =
      await this._deleteRecommendedRoutineUseCase.execute(input);

    return response;
  }

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

  public async patchThumbnail(
    @Param('id', ValidateMongoObjectId) recommendedRoutineId: string,
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
    @UploadedFile() thumbnail: MulterFile,
  ): PatchThumbnailResponse {
    const input: PatchThumbnailUseCaseParams = {
      userId: user.id,
      recommendedRoutineId,
      thumbnail,
    };

    const response: Record<string, never> =
      await this._patchThumbnailUseCase.execute(input);

    return response;
  }

  public async patchCardnews(
    @Param('id', ValidateMongoObjectId) recommendedRoutineId: string,
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
    @UploadedFiles() cardnews: MulterFile[],
  ): PatchCardnewsResponse {
    const input: PatchCardnewsUseCaseParams = {
      userId: user.id,
      recommendedRoutineId,
      cardnews,
    };

    const response: Record<string, never> =
      await this._patchCardnewsUseCase.execute(input);

    return response;
  }
}
