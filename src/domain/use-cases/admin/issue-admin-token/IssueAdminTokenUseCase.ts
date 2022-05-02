import { UseCase } from '../../UseCase';
import { IssueAdminTokenResponseDto } from './dtos/IssueAdminTokenResponseDto';
import { IssueAdminTokenUseCaseParams } from './dtos/IssueAdminTokenUseCaseParams';

export abstract class IssueAdminTokenUseCase
  implements
    UseCase<IssueAdminTokenUseCaseParams, Promise<IssueAdminTokenResponseDto>>
{
  public abstract execute(
    params: IssueAdminTokenUseCaseParams,
  ): Promise<IssueAdminTokenResponseDto>;
}
