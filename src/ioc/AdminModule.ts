import { Module } from '@nestjs/common';
import { AddBannerUseCase } from '../domain/use-cases/admin/add-banner/AddBannerUseCase';
import { AddBannerUseCaseImpl } from '../domain/use-cases/admin/add-banner/AddBannerUseCaseImpl';
import { AnalyzeRoutinesUsageUseCase } from '../domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AnalyzeRoutinesUsageUseCaseImpl } from '../domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCaseImpl';
import { CountUsersAddedOneRoutineUseCase } from '../domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineUseCaseImpl } from '../domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCaseImpl';
import { CountUsersUseCase } from '../domain/use-cases/admin/count-users/CountUsersUseCase';
import { CountUsersUseCaseImpl } from '../domain/use-cases/admin/count-users/CountUsersUseCaseImpl';
import { IssueAdminTokenUseCase } from '../domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { RefreshAdminTokenUseCase } from '../domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RefreshAdminTokenUseCaseImpl } from '../domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCaseImpl';
import { RegisterAdminUseCase } from '../domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { RegisterAdminUseCaseImpl } from '../domain/use-cases/admin/register-admin/RegisterAdminUseCaseImpl';
import { AddImageByAdminUseCase } from '../domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCase';
import { AddImageByAdminUseCaseImpl } from '../domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCaseImpl';
import { AddRecommendedRoutineUseCase } from '../domain/use-cases/admin/add-recommended-routine/AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineUseCaseImpl } from '../domain/use-cases/admin/add-recommended-routine/AddRecommendedRoutineUseCaseImpl';

import { AdminControllerInjectedDecorator } from './controllers/admin/AdminControllerInjectedDecorator';
import { ModifyBannerUseCase } from '../domain/use-cases/admin/modify-banner/ModifyBannerUseCase';
import { ModifyBannerUseCaseImpl } from '../domain/use-cases/admin/modify-banner/ModifyBannerUseCaseImpl';
import { DeleteBannerUseCase } from '../domain/use-cases/admin/delete-banner/DeleteBannerUseCase';
import { DeleteBannerUseCaseImpl } from '../domain/use-cases/admin/delete-banner/DeleteBannerUseCaseImpl';
import { DeleteRecommendedRoutineUseCase } from '../domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseImpl } from '../domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCaseImpl';
import { ModifyRecommendedRoutineUseCase } from '../domain/use-cases/admin/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseImpl } from '../domain/use-cases/admin/modify-recommended-routine/ModifyRecommendedRoutineUseCaseImpl';
import { PatchCardnewsUseCase } from '../domain/use-cases/admin/patch-cardnews/PatchCardnewsUseCase';
import { PatchCardnewsUseCaseImpl } from '../domain/use-cases/admin/patch-cardnews/PatchCardnewsUseCaseImpl';
import { PatchThumbnailUseCase } from '../domain/use-cases/admin/patch-thumbnail/PatchThumbnailUseCase';
import { PatchThumbnailUseCaseImpl } from '../domain/use-cases/admin/patch-thumbnail/PatchThumbnailUseCaseImpl';

@Module({
  providers: [
    {
      provide: RegisterAdminUseCase,
      useClass: RegisterAdminUseCaseImpl,
    },
    {
      provide: IssueAdminTokenUseCase,
      useClass: IssueAdminTokenUseCaseImpl,
    },
    {
      provide: RefreshAdminTokenUseCase,
      useClass: RefreshAdminTokenUseCaseImpl,
    },
    {
      provide: CountUsersUseCase,
      useClass: CountUsersUseCaseImpl,
    },
    {
      provide: CountUsersAddedOneRoutineUseCase,
      useClass: CountUsersAddedOneRoutineUseCaseImpl,
    },
    {
      provide: AnalyzeRoutinesUsageUseCase,
      useClass: AnalyzeRoutinesUsageUseCaseImpl,
    },
    {
      provide: AddRecommendedRoutineUseCase,
      useClass: AddRecommendedRoutineUseCaseImpl,
    },
    {
      provide: ModifyRecommendedRoutineUseCase,
      useClass: ModifyRecommendedRoutineUseCaseImpl,
    },
    {
      provide: DeleteRecommendedRoutineUseCase,
      useClass: DeleteRecommendedRoutineUseCaseImpl,
    },
    {
      provide: PatchThumbnailUseCase,
      useClass: PatchThumbnailUseCaseImpl,
    },
    {
      provide: PatchCardnewsUseCase,
      useClass: PatchCardnewsUseCaseImpl,
    },
    {
      provide: AddBannerUseCase,
      useClass: AddBannerUseCaseImpl,
    },
    {
      provide: ModifyBannerUseCase,
      useClass: ModifyBannerUseCaseImpl,
    },
    {
      provide: DeleteBannerUseCase,
      useClass: DeleteBannerUseCaseImpl,
    },
    {
      provide: AddImageByAdminUseCase,
      useClass: AddImageByAdminUseCaseImpl,
    },
  ],
  controllers: [AdminControllerInjectedDecorator],
})
export class AdminModule {}
