//PointHistoryControllerInjectedDecorator

import { Module } from '@nestjs/common';
import { GetPointHistoriesByUserIdUseCase } from '../domain/use-cases/point-history/get-point-histories-by-userid/GetPointHistoriesByUserIdUseCase';
import { GetPointHistoriesByUserIdUseCaseImpl } from '../domain/use-cases/point-history/get-point-histories-by-userid/GetPointHistoriesByUserIdUseCaseImpl';
import { GetPointHistoriesUseCase } from '../domain/use-cases/point-history/get-point-histories/GetPointHistoriesUseCase';
import { GetPointHistoriesUseCaseImpl } from '../domain/use-cases/point-history/get-point-histories/GetPointHistoriesUseCaseImpl';
import { PointHistoryControllerInjectedDecorator } from './controllers/point-history/PointHistoryControllerInjectedDecorator';

@Module({
  providers: [
    {
      provide: GetPointHistoriesByUserIdUseCase,
      useClass: GetPointHistoriesByUserIdUseCaseImpl,
    },
    {
      provide: GetPointHistoriesUseCase,
      useClass: GetPointHistoriesUseCaseImpl,
    },
  ],
  controllers: [PointHistoryControllerInjectedDecorator],
})
export class PointHistoryModule {}
