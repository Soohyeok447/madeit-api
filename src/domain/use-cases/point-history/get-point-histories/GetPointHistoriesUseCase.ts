import { UseCase } from '../../UseCase';
import { GetPointHistoriesResponseDto } from './dtos/GetPointHistoriesResponseDto';
import { GetPointHistoriesUseCaseParams } from './dtos/GetPointHistoriesUseCaseParams';

/**
 * admin 전용
 */
export abstract class GetPointHistoriesUseCase
  implements
    UseCase<
      GetPointHistoriesUseCaseParams,
      Promise<GetPointHistoriesResponseDto[]>
    >
{
  public abstract execute(
    params: GetPointHistoriesUseCaseParams,
  ): Promise<GetPointHistoriesResponseDto[]>;
}
