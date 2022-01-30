import {
  Body,
  Injectable,
  Param,
  Post,
  Put,
  Query,
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

@Injectable()
export class RoutineController {
  constructor(
    private readonly _addRoutineUseCase: AddRoutineUseCase,
    private readonly _modifyRoutineUseCase: ModifyRoutineUseCase,
    private readonly _getRoutineDetailUseCase: GetRoutineDetailUseCase,
    private readonly _getAllRoutinesByCategoryUseCase: getAllRoutinesByCategoryUseCase,
    private readonly _buyRoutineUseCase: BuyRoutineUseCase,
    private readonly _getAllRoutinesUseCase: GetAllRoutinesUseCase,
  ) { }

  async addRoutine(
    @User() user,
    @UploadedFiles() images: MulterFile[],
    @Body() addRoutineRequest: AddRoutineRequestDto,
  ): AddRoutineResponse {
    const input: AddRoutineUsecaseParams = {
      userId: user.id,
      thumbnail: images['thumbnail'][0],
      cardnews: images['cardnews'],
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
    @User() user,
    @Param('id') routineId: string,
    @Body() modifyRoutineRequest: ModifyRoutineRequestDto,
    @UploadedFiles() images?: MulterFile[],
  ): ModifyRoutineResponse {
    let thumbnail = null;
    const cardnews = images['cardnews'] ?? null;

    if (images['thumbnail']) {
      thumbnail = images['thumbnail'][0];
    }

    const input: ModifyRoutineUsecaseParams = {
      userId: user.id,
      routineId,
      thumbnail,
      cardnews,
      price: +modifyRoutineRequest.price,
      ...modifyRoutineRequest,
    };

    const routine = await this._modifyRoutineUseCase.execute(input);

    const response = {
      ...routine,
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
