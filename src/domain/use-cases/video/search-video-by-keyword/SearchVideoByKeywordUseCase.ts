import { UseCase } from '../../UseCase';
import { SearchVideoByKeywordResponse } from '../response.index';
import { SearchVideoByKeywordUseCaseParams } from './dtos/SearchVideoByKeywordUseCaseParams';

export abstract class SearchVideoByKeywordUseCase
  implements
    UseCase<SearchVideoByKeywordUseCaseParams, SearchVideoByKeywordResponse>
{
  abstract execute(
    params: SearchVideoByKeywordUseCaseParams,
  ): SearchVideoByKeywordResponse;
}
