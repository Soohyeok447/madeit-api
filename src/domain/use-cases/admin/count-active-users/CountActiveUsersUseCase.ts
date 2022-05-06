import { UseCase } from '../../UseCase';
import { CountActiveUsersResponseDto } from './dtos/CountActiveUsersResponseDto';
import { CountActiveUsersUseCaseParams } from './dtos/CountActiveUsersUseCaseParams';

export abstract class CountActiveUsersUseCase
  implements
    UseCase<
      CountActiveUsersUseCaseParams,
      Promise<CountActiveUsersResponseDto>
    >
{
  public abstract execute(
    params: CountActiveUsersUseCaseParams,
  ): Promise<CountActiveUsersResponseDto>;
}
