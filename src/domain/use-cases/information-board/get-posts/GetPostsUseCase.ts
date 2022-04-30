import { UseCase } from '../../UseCase';
import { GetPostsResponse } from '../response.index';
import { GetPostsUseCaseParams } from './dtos/GetPostsUseCaseParams';

export abstract class GetPostsUseCase
  implements UseCase<GetPostsUseCaseParams, GetPostsResponse>
{
  public abstract execute({
    size,
    next,
  }: GetPostsUseCaseParams): GetPostsResponse;
}
