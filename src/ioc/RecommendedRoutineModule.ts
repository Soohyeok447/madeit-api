import { Module } from '@nestjs/common';
import { RecommendedRoutineControllerInjectedDecorator } from './controllers/recommended-routine/RecommendRoutineControllerInjectedSwagger';
import { AddRecommendedRoutineUseCase } from '../domain/use-cases/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCase';
import { AddRecommendedRoutineUseCaseImpl } from '../domain/use-cases/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCaseImpl';
import { ModifyRecommendedRoutineUseCase } from '../domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseImpl } from '../domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCaseImpl';
import { DeleteRecommendedRoutineUseCase } from '../domain/use-cases/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseImpl } from '../domain/use-cases/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCaseImpl';
import { GetRecommendedRoutineUseCase } from '../domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCase';
import { GetRecommendedRoutineUseCaseImpl } from '../domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCaseImpl';
import { GetRecommendedRoutinesByCategoryUseCase } from '../domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCase';
import { GetRecommendedRoutinesByCategoryUseCaseImpl } from '../domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCaseImpl';
import { PatchThumbnailUseCase } from '../domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCase';
import { PatchThumbnailUseCaseImpl } from '../domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCaseImpl';
import { PatchCardnewsUseCase } from '../domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCase';
import { PatchCardnewsUseCaseImpl } from '../domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCaseImpl';

@Module({
  imports: [],
  controllers: [RecommendedRoutineControllerInjectedDecorator],
  providers: [
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
      provide: GetRecommendedRoutineUseCase,
      useClass: GetRecommendedRoutineUseCaseImpl,
    },
    {
      provide: GetRecommendedRoutinesByCategoryUseCase,
      useClass: GetRecommendedRoutinesByCategoryUseCaseImpl,
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
  exports: [],
})
export class RecommendedRoutineModule {}
