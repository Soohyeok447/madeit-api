import { UseCase } from '../../UseCase';
import { RegisterAdminResponseDto } from './dtos/RegisterAdminResponseDto';
import { RegisterAdminUseCaseParams } from './dtos/RegisterAdminUseCaseParams';

export abstract class RegisterAdminUseCase
  implements
    UseCase<RegisterAdminUseCaseParams, Promise<RegisterAdminResponseDto>>
{
  public abstract execute(
    params: RegisterAdminUseCaseParams,
  ): Promise<RegisterAdminResponseDto>;
}
