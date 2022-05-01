import { Injectable } from '@nestjs/common';
import { GetPointHistoriesByUserIdResponseDto } from '../../domain/use-cases/point-history/get-point-histories-by-userid/dtos/GetPointHistoriesByUserIdResponseDto';
import { GetPointHistoriesByUserIdUseCase } from '../../domain/use-cases/point-history/get-point-histories-by-userid/GetPointHistoriesByUserIdUseCase';
import { GetPointHistoriesResponseDto } from '../../domain/use-cases/point-history/get-point-histories/dtos/GetPointHistoriesResponseDto';
import { GetPointHistoriesUseCase } from '../../domain/use-cases/point-history/get-point-histories/GetPointHistoriesUseCase';
import { UserPayload } from '../common/decorators/user.decorator';

@Injectable()
export class PointHistoryController {
  public constructor(
    private readonly getPointHistoriesUseCase: GetPointHistoriesUseCase,
    private readonly getPointHistoriesByUserIdUseCase: GetPointHistoriesByUserIdUseCase,
  ) {}

  public async getPointHistories(
    user: UserPayload,
  ): Promise<GetPointHistoriesResponseDto[]> {
    return this.getPointHistoriesByUserIdUseCase.execute({
      userId: user.id,
    });
  }

  public async getPointHistoriesByUserId(
    user: UserPayload,
  ): Promise<GetPointHistoriesByUserIdResponseDto[]> {
    return this.getPointHistoriesUseCase.execute({
      userId: user.id,
    });
  }
}
