import { UseCase } from '../../UseCase';
import { AddImageByAdminResponseDto } from './dtos/AddImageByAdminResponseDto';
import { AddImageByAdminUseCaseParams } from './dtos/AddImageByAdminUseCaseParams';

export abstract class AddImageByAdminUseCase
  implements
    UseCase<AddImageByAdminUseCaseParams, Promise<AddImageByAdminResponseDto>>
{
  public abstract execute(
    params: AddImageByAdminUseCaseParams,
  ): Promise<AddImageByAdminResponseDto>;
}
