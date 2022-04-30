import { UseCase } from '../../UseCase';
import { PutCardnewsResponse } from '../response.index';
import { PutCardnewsUseCaseParams } from './dtos/PutCardnewsUseCaseParams';

export abstract class PutCardnewsUseCase
  implements UseCase<PutCardnewsUseCaseParams, PutCardnewsResponse>
{
  public abstract execute({
    userId,
    postId,
    cardnews,
  }: PutCardnewsUseCaseParams): PutCardnewsResponse;
}
