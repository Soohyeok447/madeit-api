import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { CountUsersResponseDto } from '../../domain/use-cases/admin/count-users/dtos/CountUsersResponseDto';
import { CountUsersUseCase } from '../../domain/use-cases/admin/count-users/CountUsersUseCase';
// import { RegisterAdminResponseDto } from '../../domain/use-cases/admin/register-admin/dtos/RegisterAdminResponseDto';
// import { RegisterAdminRequestDto } from './register-admin/RegisterAdminRequestDto';
import { IssueAdminTokenResponseDto } from '../../domain/use-cases/admin/issue-admin-token/dtos/IssueAdminTokenResponseDto';
import { IssueAdminTokenUseCase } from '../../domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { RefreshAdminTokenResponseDto } from '../../domain/use-cases/admin/refresh-admin-token/dtos/RefreshAdminTokenResponseDto';
import { RefreshAdminTokenUseCase } from '../../domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RegisterAdminUseCase } from '../../domain/use-cases/admin/register-admin/RegisterAdminUseCase';
// import { getEnvironment } from '../../infrastructure/environment';
import { IssueAdminTokenRequestDto } from './issue-admin-token/IssueAdminTokenRequestDto';
import { CountUsersAddedOneRoutineResponseDto } from '../../domain/use-cases/admin/count-users-added-one-routine/dtos/CountUsersAddedOneRoutineResponseDto';
import { CountUsersAddedOneRoutineUseCase } from '../../domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { AnalyzeRoutinesUsageResponseDto } from '../../domain/use-cases/admin/analyze-routines-usage/dtos/AnalyzeRoutinesUsageResponseDto';
import { AnalyzeRoutinesUsageUseCase } from '../../domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AddRecommendedRoutineUseCase } from '../../domain/use-cases/admin/add-recommended-routine/AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineRequestDto } from '../recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { AddRecommendedRoutineUseCaseParams } from '../../domain/use-cases/admin/add-recommended-routine/dtos/AddRecommendedRoutineUseCaseParams';
import { AddRecommendedRoutineResponseDto } from '../../domain/use-cases/admin/add-recommended-routine/dtos/AddRecommendedRoutineResponseDto';
import { MulterFile } from '../../domain/common/types';
import { ModifyRecommendedRoutineRequestDto } from '../recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineRequestDto';
import { getEnvironment } from '../../infrastructure/environment';
import { AddBannerUseCase } from '../../domain/use-cases/admin/add-banner/AddBannerUseCase';
import { AddBannerUseCaseParams } from '../../domain/use-cases/admin/add-banner/dtos/AddBannerUseCaseParams';
import { AddBannerResponseDto } from '../../domain/use-cases/admin/add-banner/dtos/AddBannerResponseDto';
import { AddImageByAdminResponseDto } from '../../domain/use-cases/admin/add-image-by-admin/dtos/AddImageByAdminResponseDto';
import { AddImageByAdminUseCaseParams } from '../../domain/use-cases/admin/add-image-by-admin/dtos/AddImageByAdminUseCaseParams';
import { AddImageByAdminUseCase } from '../../domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCase';
import { AddBannerRequestDto } from './add-banner/AddBannerRequestDto';
import { ModifyBannerUseCase } from '../../domain/use-cases/admin/modify-banner/ModifyBannerUseCase';
import { ModifyBannerRequestDto } from './modify-banner/ModifyBannerRequestDto';
import { ModifyBannerUseCaseParams } from '../../domain/use-cases/admin/modify-banner/dtos/ModifyBannerUseCaseParams';
import { ModifyBannerResponseDto } from '../../domain/use-cases/admin/modify-banner/dtos/ModifyBannerResponseDto';
import { DeleteBannerResponseDto } from '../../domain/use-cases/admin/delete-banner/dtos/DeleteBannerResponseDto';
import { DeleteBannerUseCaseParams } from '../../domain/use-cases/admin/delete-banner/dtos/DeleteBannerUseCaseParams';
import { DeleteBannerUseCase } from '../../domain/use-cases/admin/delete-banner/DeleteBannerUseCase';
import { DeleteRecommendedRoutineUseCase } from '../../domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseParams } from '../../domain/use-cases/admin/delete-recommended-routine/dtos/DeleteRecommendedRoutineUseCaseParams';
import { ModifyRecommendedRoutineResponseDto } from '../../domain/use-cases/admin/modify-recommended-routine/dtos/ModifyRecommendedRoutineResponseDto';
import { ModifyRecommendedRoutineUseCaseParams } from '../../domain/use-cases/admin/modify-recommended-routine/dtos/ModifyRecommendedRoutineUseCaseParams';
import { ModifyRecommendedRoutineUseCase } from '../../domain/use-cases/admin/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { PatchCardnewsUseCaseParams } from '../../domain/use-cases/admin/patch-cardnews/dtos/PatchCardnewsUseCaseParams';
import { PatchCardnewsUseCase } from '../../domain/use-cases/admin/patch-cardnews/PatchCardnewsUseCase';
import { PatchThumbnailUseCaseParams } from '../../domain/use-cases/admin/patch-thumbnail/dtos/PatchThumbnailUseCaseParams';
import { PatchThumbnailUseCase } from '../../domain/use-cases/admin/patch-thumbnail/PatchThumbnailUseCase';
import { PatchThumbnailResponseDto } from '../../domain/use-cases/admin/patch-thumbnail/dtos/PatchThumbnailResponseDto';
import { PatchCardnewsResponseDto } from '../../domain/use-cases/admin/patch-cardnews/dtos/PatchCardnewsResponseDto';
import { DeleteRecommendedRoutineResponseDto } from '../../domain/use-cases/admin/delete-recommended-routine/dtos/DeleteRecommendedRoutineResponseDto';

@Injectable()
export class AdminController {
  public constructor(
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly issueAdminTokenUseCase: IssueAdminTokenUseCase,
    private readonly refreshAdminTokenUseCase: RefreshAdminTokenUseCase,
    private readonly countActiveUsersUseCase: CountUsersUseCase,
    private readonly countUsersAddedOneRoutineUseCase: CountUsersAddedOneRoutineUseCase,
    private readonly analyzeRoutinesUsageUseCase: AnalyzeRoutinesUsageUseCase,
    private readonly addRecommendedRoutineUseCase: AddRecommendedRoutineUseCase,
    private readonly modifyRecommendedRoutineUseCase: ModifyRecommendedRoutineUseCase,
    private readonly deleteRecommendedRoutineUseCase: DeleteRecommendedRoutineUseCase,
    private readonly patchThumbnailUseCase: PatchThumbnailUseCase,
    private readonly patchCardnewsUseCase: PatchCardnewsUseCase,
    private readonly addBannerUseCase: AddBannerUseCase,
    private readonly modifyBannerUseCase: ModifyBannerUseCase,
    private readonly deleteBannerUseCase: DeleteBannerUseCase,
    private readonly addImageByAdminUseCase: AddImageByAdminUseCase,
  ) {}

  // public async registerAdmin({
  //   id,
  //   password,
  // }: RegisterAdminRequestDto): Promise<RegisterAdminResponseDto> {
  //   return this.registerAdminUseCase.execute({
  //     id,
  //     password,
  //   });
  // }

  public async issueAdminToken(
    { id, password }: IssueAdminTokenRequestDto,
    res: Response,
  ): Promise<Record<string, never>> {
    const result: IssueAdminTokenResponseDto =
      await this.issueAdminTokenUseCase.execute({ id, password });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: getEnvironment() !== 'test' ? true : false,
      secure: getEnvironment() !== 'test' ? true : false,
      sameSite: 'none',
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: getEnvironment() !== 'test' ? true : false,
      secure: getEnvironment() !== 'test' ? true : false,
      sameSite: 'none',
    });

    return {};
  }

  public async refreshAdminToken(
    res: Response,
    req: Request,
  ): Promise<Record<string, never>> {
    const result: RefreshAdminTokenResponseDto =
      await this.refreshAdminTokenUseCase.execute({
        refreshToken: req.cookies['refreshToken'],
      });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: getEnvironment() !== 'test' ? true : false,
      secure: getEnvironment() !== 'test' ? true : false,
      sameSite: 'none',
    });

    return {};
  }

  public async countUsers(req: Request): Promise<CountUsersResponseDto> {
    return await this.countActiveUsersUseCase.execute({
      accessToken: req.cookies['accessToken'],
    });
  }

  public async countUsersAddedOneRoutine(
    req: Request,
  ): Promise<CountUsersAddedOneRoutineResponseDto> {
    return await this.countUsersAddedOneRoutineUseCase.execute({
      accessToken: req.cookies['accessToken'],
    });
  }

  public async analyzeRoutinesUsage(
    req: Request,
  ): Promise<AnalyzeRoutinesUsageResponseDto[]> {
    return await this.analyzeRoutinesUsageUseCase.execute({
      accessToken: req.cookies['accessToken'],
    });
  }

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

  public async addBanner(
    { title, bannerImageId, contentVideoId }: AddBannerRequestDto,
    req: Request,
  ): Promise<AddBannerResponseDto> {
    const input: AddBannerUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      title,
      bannerImageId,
      contentVideoId,
    };

    return await this.addBannerUseCase.execute(input);
  }

  public async modifyBanner(
    { title, bannerImageId, contentVideoId }: ModifyBannerRequestDto,
    req: Request,
  ): Promise<ModifyBannerResponseDto> {
    const input: ModifyBannerUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      title,
      bannerId: req.params['id'],
      bannerImageId,
      contentVideoId,
    };

    return await this.modifyBannerUseCase.execute(input);
  }

  public async deleteBanner(req: Request): Promise<DeleteBannerResponseDto> {
    const input: DeleteBannerUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      bannerId: req.params['id'],
    };

    return await this.deleteBannerUseCase.execute(input);
  }

  public async addImageByAdmin(
    req: Request,
    image: Express.Multer.File,
  ): Promise<AddImageByAdminResponseDto> {
    const input: AddImageByAdminUseCaseParams = {
      accessToken: req.cookies ? req.cookies['accessToken'] : null,
      image,
      description: req.body['description'],
    };

    return await this.addImageByAdminUseCase.execute(input);
  }
}
