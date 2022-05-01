import { UseCase } from '../../UseCase';
import { GetPointHistoriesByUserIdResponseDto } from './dtos/GetPointHistoriesByUserIdResponseDto';
import { GetPointHistoriesByUserIdUseCaseParams } from './dtos/GetPointHistoriesByUserIdUseCaseParams';

export abstract class GetPointHistoriesByUserIdUseCase
  implements
    UseCase<
      GetPointHistoriesByUserIdUseCaseParams,
      Promise<GetPointHistoriesByUserIdResponseDto[]>
    >
{
  public abstract execute(
    params: GetPointHistoriesByUserIdUseCaseParams,
  ): Promise<GetPointHistoriesByUserIdResponseDto[]>;
}
