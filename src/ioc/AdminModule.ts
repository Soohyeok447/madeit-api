import { Module } from '@nestjs/common';
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
import { AddRecommendedRoutineUseCase } from '../domain/use-cases/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineUseCaseImpl } from '../domain/use-cases/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCaseImpl';
import { DeleteRecommendedRoutineUseCase } from '../domain/use-cases/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseImpl } from '../domain/use-cases/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCaseImpl';
import { ModifyRecommendedRoutineUseCase } from '../domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseImpl } from '../domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCaseImpl';
import { PatchCardnewsUseCase } from '../domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCase';
import { PatchCardnewsUseCaseImpl } from '../domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCaseImpl';
import { PatchThumbnailUseCase } from '../domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCase';
import { PatchThumbnailUseCaseImpl } from '../domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCaseImpl';
import { AdminControllerInjectedDecorator } from './controllers/admin/AdminControllerInjectedDecorator';

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
  ],
  controllers: [AdminControllerInjectedDecorator],
})
export class AdminModule {}
