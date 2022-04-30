import { UseCase } from '../../UseCase';
import { GetPostResponse } from '../response.index';
import { GetPostUseCaseParams } from './dtos/GetPostUseCaseParams';

export abstract class GetPostUseCase
  implements UseCase<GetPostUseCaseParams, GetPostResponse>
{
  public abstract execute({ postId }: GetPostUseCaseParams): GetPostResponse;
}
