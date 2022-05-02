import { UseCase } from '../../UseCase';
import { RefreshAdminTokenResponseDto } from './dtos/RefreshAdminTokenResponseDto';
import { RefreshAdminTokenUseCaseParams } from './dtos/RefreshAdminTokenUseCaseParams';

export abstract class RefreshAdminTokenUseCase
  implements
    UseCase<
      RefreshAdminTokenUseCaseParams,
      Promise<RefreshAdminTokenResponseDto>
    >
{
  public abstract execute(
    params: RefreshAdminTokenUseCaseParams,
  ): Promise<RefreshAdminTokenResponseDto>;
}
