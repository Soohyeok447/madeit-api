import { UseCase } from '../../UseCase';
import { ModifyPostResponse } from '../response.index';
import { ModifyPostUseCaseParams } from './dtos/ModifyPostUseCaseParams';

export abstract class ModifyPostUseCase
  implements UseCase<ModifyPostUseCaseParams, ModifyPostResponse>
{
  public abstract execute({
    title,
  }: ModifyPostUseCaseParams): ModifyPostResponse;
}
