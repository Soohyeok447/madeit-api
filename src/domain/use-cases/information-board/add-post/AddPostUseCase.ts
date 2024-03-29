import { UseCase } from '../../UseCase';
import { AddPostResponse } from '../response.index';
import { AddPostUseCaseParams } from './dtos/AddPostUseCaseParams';

export abstract class AddPostUseCase
  implements UseCase<AddPostUseCaseParams, AddPostResponse>
{
  public abstract execute({
    title,
    userId,
  }: AddPostUseCaseParams): AddPostResponse;
}
