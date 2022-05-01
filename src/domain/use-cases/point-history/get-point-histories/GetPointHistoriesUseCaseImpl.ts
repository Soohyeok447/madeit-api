import { Injectable } from '@nestjs/common';
import { LoggerProvider } from 'src/domain/providers/LoggerProvider';
import { UserNotAdminException } from '../../../common/exceptions/customs/UserNotAdminException';
import { PointHistory } from '../../../entities/PointHistory';
import { User } from '../../../entities/User';
import { MomentProvider } from '../../../providers/MomentProvider';
import { PointHistoryRepository } from '../../../repositories/point-history/PointHistoryRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { GetPointHistoriesResponseDto } from './dtos/GetPointHistoriesResponseDto';
import { GetPointHistoriesUseCaseParams } from './dtos/GetPointHistoriesUseCaseParams';
import { GetPointHistoriesUseCase } from './GetPointHistoriesUseCase';

@Injectable()
export class GetPointHistoriesUseCaseImpl implements GetPointHistoriesUseCase {
  public constructor(
    private readonly _logger: LoggerProvider,
    private readonly _userRepository: UserRepository,
    private readonly _pointHistoryRepository: PointHistoryRepository,
    private readonly _momentProvider: MomentProvider,
  ) {}

  public async execute({
    userId,
  }: GetPointHistoriesUseCaseParams): Promise<GetPointHistoriesResponseDto[]> {
    this._logger.setContext('GetPointHistoriesByUserId');

    const user: User = await this._userRepository.findOne(userId);

    if (!user.isAdmin) {
      throw new UserNotAdminException(
        this._logger.getContext(),
        `비어드민인 유저가 전체유저의 포인트 히스토리를 불러오기 시도`,
      );
    }

    const pointHistories: PointHistory[] =
      await this._pointHistoryRepository.findAll();

    if (!pointHistories.length) return [];

    const mappedResult: GetPointHistoriesResponseDto[] = pointHistories.map(
      (e) => {
        const timestamp: string = this._momentProvider.parseCreatedAt(
          e.createdAt,
        );
        return {
          id: e.id,
          message: e.message,
          point: e.point.toString(),
          timestamp,
        };
      },
    );

    return mappedResult;
  }
}
