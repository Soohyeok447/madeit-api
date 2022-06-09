import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { MulterFile } from '../../../domain/common/types';
import { AddRecommendedRoutineUseCase } from '../../../domain/use-cases/admin/add-recommended-routine/AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineResponseDto } from '../../../domain/use-cases/admin/add-recommended-routine/dtos/AddRecommendedRoutineResponseDto';
import { AddRecommendedRoutineUseCaseParams } from '../../../domain/use-cases/admin/add-recommended-routine/dtos/AddRecommendedRoutineUseCaseParams';
import { DeleteRecommendedRoutineUseCase } from '../../../domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineResponseDto } from '../../../domain/use-cases/admin/delete-recommended-routine/dtos/DeleteRecommendedRoutineResponseDto';
import { DeleteRecommendedRoutineUseCaseParams } from '../../../domain/use-cases/admin/delete-recommended-routine/dtos/DeleteRecommendedRoutineUseCaseParams';
import { ModifyRecommendedRoutineResponseDto } from '../../../domain/use-cases/admin/modify-recommended-routine/dtos/ModifyRecommendedRoutineResponseDto';
import { ModifyRecommendedRoutineUseCaseParams } from '../../../domain/use-cases/admin/modify-recommended-routine/dtos/ModifyRecommendedRoutineUseCaseParams';
import { ModifyRecommendedRoutineUseCase } from '../../../domain/use-cases/admin/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { PatchCardnewsResponseDto } from '../../../domain/use-cases/admin/patch-cardnews/dtos/PatchCardnewsResponseDto';
import { PatchCardnewsUseCaseParams } from '../../../domain/use-cases/admin/patch-cardnews/dtos/PatchCardnewsUseCaseParams';
import { PatchCardnewsUseCase } from '../../../domain/use-cases/admin/patch-cardnews/PatchCardnewsUseCase';
import { PatchThumbnailResponseDto } from '../../../domain/use-cases/admin/patch-thumbnail/dtos/PatchThumbnailResponseDto';
import { PatchThumbnailUseCaseParams } from '../../../domain/use-cases/admin/patch-thumbnail/dtos/PatchThumbnailUseCaseParams';
import { PatchThumbnailUseCase } from '../../../domain/use-cases/admin/patch-thumbnail/PatchThumbnailUseCase';
import { AddRecommendedRoutineRequestDto } from './add-recommended-routine/AddRecommendedRoutineRequestDto';
import { ModifyRecommendedRoutineRequestDto } from './modify-recommended-routine/ModifyRecommendedRoutineRequestDto';
@Injectable()
export class AdminRecommendedRoutineController {
  public constructor(
    private readonly addRecommendedRoutineUseCase: AddRecommendedRoutineUseCase,
    private readonly modifyRecommendedRoutineUseCase: ModifyRecommendedRoutineUseCase,
    private readonly deleteRecommendedRoutineUseCase: DeleteRecommendedRoutineUseCase,
    private readonly patchThumbnailUseCase: PatchThumbnailUseCase,
    private readonly patchCardnewsUseCase: PatchCardnewsUseCase,
  ) {}

  public async addRecommendedRoutine(
    req: Request,
    addRecommendedRoutineRequest: AddRecommendedRoutineRequestDto,
  ): Promise<AddRecommendedRoutineResponseDto> {
    const input: AddRecommendedRoutineUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      ...addRecommendedRoutineRequest,
    };

    const response: AddRecommendedRoutineResponseDto =
      await this.addRecommendedRoutineUseCase.execute(input);

    return response;
  }

  public async modifyRecommendedRoutine(
    routineId: string,
    modifyRecommendedRoutineRequest: ModifyRecommendedRoutineRequestDto,
    req: Request,
  ): Promise<ModifyRecommendedRoutineResponseDto> {
    const input: ModifyRecommendedRoutineUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      recommendedRoutineId: routineId,
      ...modifyRecommendedRoutineRequest,
    };

    const response: ModifyRecommendedRoutineResponseDto =
      await this.modifyRecommendedRoutineUseCase.execute(input);

    return response;
  }

  public async deleteRecommendedRoutine(
    routineId: string,
    req: Request,
  ): Promise<DeleteRecommendedRoutineResponseDto> {
    const input: DeleteRecommendedRoutineUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      recommendedRoutineId: routineId,
    };

    const response: any = await this.deleteRecommendedRoutineUseCase.execute(
      input,
    );

    return response;
  }

  public async patchThumbnail(
    recommendedRoutineId: string,
    thumbnail: MulterFile,
    req: Request,
  ): Promise<PatchThumbnailResponseDto> {
    const input: PatchThumbnailUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      recommendedRoutineId,
      thumbnail,
    };

    return await this.patchThumbnailUseCase.execute(input);
  }

  public async patchCardnews(
    recommendedRoutineId: string,
    cardnews: MulterFile[],
    req: Request,
  ): Promise<PatchCardnewsResponseDto> {
    const input: PatchCardnewsUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      recommendedRoutineId,
      cardnews,
    };

    return await this.patchCardnewsUseCase.execute(input);
  }
}
