import { UseCase } from '../../UseCase';
import { AddImageByUserResponseDto } from './dtos/AddImageByUserResponseDto';
import { AddImageByUserUseCaseParams } from './dtos/AddImageByUserUseCaseParams';

export abstract class AddImageByUserUseCase
  implements
    UseCase<AddImageByUserUseCaseParams, Promise<AddImageByUserResponseDto>>
{
  public abstract execute(
    params: AddImageByUserUseCaseParams,
  ): Promise<AddImageByUserResponseDto>;
}
