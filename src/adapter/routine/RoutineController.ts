import {
  Body,
  Injectable,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { Resolution } from '../../domain/enums/Resolution';
import { MulterFile } from '../../domain/types';
import { AddRoutineUsecaseParams } from '../../domain/use-cases/routine/add-routine/dtos/AddRoutineUsecaseParams';
import { User } from '../common/decorators/user.decorator';
import { AddRoutineRequestDto } from './add-routine/AddRoutineRequestDto';
import { ModifyRoutineRequestDto } from './modify-routine/ModifyRoutineRequestDto';
import {
  AddRoutineResponse,
  BuyRoutineResponse,
  GetAllRoutinesByCategoryResponse,
  GetAllRoutinesResponse,
  GetRoutineDetailResponse,
  ModifyRoutineResponse,
  PatchCardnewsResponse,
  PatchThumbnailResponse,
} from '../../domain/use-cases/routine/response.index';
import { BuyRoutineUsecaseParams } from '../../domain/use-cases/routine/buy-routine/dtos/BuyRoutineUsecaseParams';
import { GetRoutineDetailUsecaseParams } from '../../domain/use-cases/routine/get-routine-detail/dtos/GetRoutineDetailUsecaseParams';
import { ModifyRoutineUsecaseParams } from '../../domain/use-cases/routine/modify-routine/dtos/ModifyRoutineUsecaseParams';
import { GetAllRoutinesByCategoryUsecaseParams } from '../../domain/use-cases/routine/get-all-routines-by-category/dtos/GetAllRoutinesByCategoryUsecaseParams';
import { GetAllRoutinesUsecaseParams } from '../../domain/use-cases/routine/get-all-routines/dtos/GetAllRoutinesUsecaseParams';
import { GetRoutineDetailUseCase } from 'src/domain/use-cases/routine/get-routine-detail/GetRoutineDetailUseCase';
import { GetAllRoutinesUseCase } from 'src/domain/use-cases/routine/get-all-routines/GetAllRoutinesUseCase';
import { getAllRoutinesByCategoryUseCase } from 'src/domain/use-cases/routine/get-all-routines-by-category/GetAllRoutinesByCategoryUseCase';
import { ModifyRoutineUseCase } from 'src/domain/use-cases/routine/modify-routine/ModifyRoutineUseCase';
import { AddRoutineUseCase } from 'src/domain/use-cases/routine/add-routine/AddRoutineUseCase';
import { BuyRoutineUseCase } from 'src/domain/use-cases/routine/buy-routine/BuyRoutineUseCase';
import { ValidateCustomDecorators, ValidateMongoObjectId } from '../common/validators/ValidateMongoObjectId';
import { PatchThumbnailRequestDto } from './patch-thumbnail/PatchThumbnailRequestDto';
import { PatchThumbnailUseCaseParams } from 'src/domain/use-cases/routine/patch-thumbnail/dtos/PatchThumbnailUseCaseParams';
import { PatchThumbnailUseCase } from 'src/domain/use-cases/routine/patch-thumbnail/PatchThumbnailUseCase';
import { PatchCardnewsUseCase } from 'src/domain/use-cases/routine/patch-cardnews/PatchCardnewsUseCase';
import { PatchCardnewsUseCaseParams } from 'src/domain/use-cases/routine/patch-cardnews/dtos/PatchCardnewsUseCaseParams';

@Injectable()
export class RoutineController {
  constructor(
    private readonly _addRoutineUseCase: AddRoutineUseCase,
    private readonly _modifyRoutineUseCase: ModifyRoutineUseCase,
    private readonly _getRoutineDetailUseCase: GetRoutineDetailUseCase,
    private readonly _getAllRoutinesByCategoryUseCase: getAllRoutinesByCategoryUseCase,
    private readonly _patchThumbnailUseCase: PatchThumbnailUseCase,
    private readonly _patchCardnewsUseCase: PatchCardnewsUseCase,
    private readonly _buyRoutineUseCase: BuyRoutineUseCase,
    private readonly _getAllRoutinesUseCase: GetAllRoutinesUseCase,
  ) { }

  async addRoutine(
    @User() user,
    @UploadedFiles() images: MulterFile[], //TODO 뺄겁니다.
    @Body() addRoutineRequest: AddRoutineRequestDto,
  ): AddRoutineResponse {
    const input: AddRoutineUsecaseParams = { 
      userId: user.id,
      price: +addRoutineRequest.price,
      ...addRoutineRequest,
    };

    const routine = await this._addRoutineUseCase.execute(input);

    const response = {
      ...routine
    };

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
      price: +modifyRoutineRequest.price,
      ...modifyRoutineRequest,
    };

    const routine = await this._modifyRoutineUseCase.execute(input);

    const response = {
      ...routine,
    };

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
    
    const routine = await this._patchThumbnailUseCase.execute(input);

    const response = {
      ...routine
    };

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
    
    const routine = await this._patchCardnewsUseCase.execute(input);

    const response = {
      ...routine
    };

    return response;
  }

  // async getAllRoutines(@Query() query): GetAllRoutinesResponse {
  //   const input: GetAllRoutinesUsecaseParams = {
  //     next: query['next'],
  //     size: +query['size'],
  //     resolution: query['resolution'],
  //   };

  //   const { paging, data } = await this.getAllRoutinesUseCase.execute(input);

  //   const response = {
  //     paging,
  //     data,
  //   };

  //   return response;
  // }

  async getAllRoutinesByCategory(
    @Query() query,
  ): GetAllRoutinesByCategoryResponse {
    const input: GetAllRoutinesByCategoryUsecaseParams = {
      category: query['category'],
      next: query['next'],
      size: +query['size'],
      resolution: query['resolution'],
    };

    const { hasMore, nextCursor, data } =
      await this._getAllRoutinesByCategoryUseCase.execute(input);

    const response = {
      hasMore,
      nextCursor,
      data,
    };

    return response;
  }

  async getRoutineDetail(
    @Param('id') routineId: string,
    @Query('resolution') resolution: Resolution,
  ): GetRoutineDetailResponse {
    const input: GetRoutineDetailUsecaseParams = {
      routineId,
      resolution,
    };

    const { ...routine } = await this._getRoutineDetailUseCase.execute(input);

    const response = {
      ...routine,
    };

    return response;
  }
}
