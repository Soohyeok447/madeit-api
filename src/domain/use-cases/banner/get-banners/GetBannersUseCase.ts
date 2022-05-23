import { UseCase } from '../../UseCase';
import { GetBannersResponseDto } from './dtos/GetBannersResponseDto';
import { GetBannersUseCaseParams } from './dtos/GetBannersUseCaseParams';

export abstract class GetBannersUseCase
  implements UseCase<GetBannersUseCaseParams, Promise<GetBannersResponseDto[]>>
{
  public abstract execute(
    params: GetBannersUseCaseParams,
  ): Promise<GetBannersResponseDto[]>;
}
