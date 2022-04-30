import { UseCase } from '../../UseCase';
import { DeletePostResponse } from '../response.index';
import { DeletePostUseCaseParams } from './dtos/DeletePostUseCaseParams';

export abstract class DeletePostUseCase
  implements UseCase<DeletePostUseCaseParams, DeletePostResponse>
{
  public abstract execute({
    userId,
    postId,
  }: DeletePostUseCaseParams): DeletePostResponse;
}
