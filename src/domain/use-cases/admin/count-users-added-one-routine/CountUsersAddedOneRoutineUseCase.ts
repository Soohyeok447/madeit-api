import { UseCase } from '../../UseCase';
import { CountUsersAddedOneRoutineResponseDto } from './dtos/CountUsersAddedOneRoutineResponseDto';
import { CountUsersAddedOneRoutineUseCaseParams } from './dtos/CountUsersAddedOneRoutineUseCaseParams';

export abstract class CountUsersAddedOneRoutineUseCase
  implements
    UseCase<
      CountUsersAddedOneRoutineUseCaseParams,
      Promise<CountUsersAddedOneRoutineResponseDto>
    >
{
  public abstract execute(
    params: CountUsersAddedOneRoutineUseCaseParams,
  ): Promise<CountUsersAddedOneRoutineResponseDto>;
}
