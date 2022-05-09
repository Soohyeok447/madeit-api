import { UseCase } from '../../UseCase';
import { CountUsersResponseDto } from './dtos/CountUsersResponseDto';
import { CountUsersUseCaseParams } from './dtos/CountUsersUseCaseParams';

export abstract class CountUsersUseCase
  implements UseCase<CountUsersUseCaseParams, Promise<CountUsersResponseDto>>
{
  public abstract execute(
    params: CountUsersUseCaseParams,
  ): Promise<CountUsersResponseDto>;
}
