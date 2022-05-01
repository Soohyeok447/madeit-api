import { Injectable } from '@nestjs/common';
import { LoggerProvider } from 'src/domain/providers/LoggerProvider';
import { PointHistory } from '../../../entities/PointHistory';
import { User } from '../../../entities/User';
import { MomentProvider } from '../../../providers/MomentProvider';
import { PointHistoryRepository } from '../../../repositories/point-history/PointHistoryRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { GetPointHistoriesByUserIdResponseDto } from './dtos/GetPointHistoriesByUserIdResponseDto';
import { GetPointHistoriesByUserIdUseCaseParams } from './dtos/GetPointHistoriesByUserIdUseCaseParams';
import { GetPointHistoriesByUserIdUseCase } from './GetPointHistoriesByUserIdUseCase';

@Injectable()
export class GetPointHistoriesByUserIdUseCaseImpl
  implements GetPointHistoriesByUserIdUseCase
{
  public constructor(
    private readonly _logger: LoggerProvider,
    private readonly _userRepository: UserRepository,
    private readonly _pointHistoryRepository: PointHistoryRepository,
    private readonly _momentProvider: MomentProvider,
  ) {}

  public async execute({
    userId,
  }: GetPointHistoriesByUserIdUseCaseParams): Promise<
    GetPointHistoriesByUserIdResponseDto[]
  > {
    this._logger.setContext('GetPointHistories');

    const user: User = await this._userRepository.findOne(userId);

    const pointHistories: PointHistory[] =
      await this._pointHistoryRepository.findAllByUserId(user.id);

    if (!pointHistories.length) return [];

    const mappedResult: GetPointHistoriesByUserIdResponseDto[] =
      pointHistories.map((e) => {
        const timestamp: string = this._momentProvider.parseCreatedAt(
          e.createdAt,
        );

        return {
          id: e.id,
          message: e.message,
          point: e.point.toString(),
          timestamp,
        };
      });

    return mappedResult;
  }
}
