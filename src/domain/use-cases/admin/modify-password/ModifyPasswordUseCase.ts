import { UseCase } from '../../UseCase';
import { ModifyPasswordResponseDto } from './dtos/ModifyPasswordResponseDto';
import { ModifyPasswordUseCaseParams } from './dtos/ModifyPasswordUseCaseParams';

export abstract class ModifyPasswordUseCase
  implements
    UseCase<ModifyPasswordUseCaseParams, Promise<ModifyPasswordResponseDto>>
{
  public abstract execute({
    id,
    oldPassword,
    newPassword,
  }: ModifyPasswordUseCaseParams): Promise<ModifyPasswordResponseDto>;
}
