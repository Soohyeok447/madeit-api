import { Module } from '@nestjs/common';
import { RecommendedRoutineControllerInjectedDecorator } from './controllers/recommended-routine/RecommendRoutineControllerInjectedSwagger';
import { GetRecommendedRoutineUseCase } from '../domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCase';
import { GetRecommendedRoutineUseCaseImpl } from '../domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCaseImpl';
import { GetRecommendedRoutinesByCategoryUseCase } from '../domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCase';
import { GetRecommendedRoutinesByCategoryUseCaseImpl } from '../domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCaseImpl';

@Module({
  imports: [],
  controllers: [RecommendedRoutineControllerInjectedDecorator],
  providers: [
    {
      provide: GetRecommendedRoutineUseCase,
      useClass: GetRecommendedRoutineUseCaseImpl,
    },
    {
      provide: GetRecommendedRoutinesByCategoryUseCase,
      useClass: GetRecommendedRoutinesByCategoryUseCaseImpl,
    },
  ],
  exports: [],
})
export class RecommendedRoutineModule {}
