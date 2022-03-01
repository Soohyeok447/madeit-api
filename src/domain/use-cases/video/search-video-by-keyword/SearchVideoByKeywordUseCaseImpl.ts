import { Injectable } from '@nestjs/common';
import { YoutubeProvider } from '../../../providers/YoutubeProvider';
import { SearchVideoByKeywordResponse } from '../response.index';
import { SearchVideoByKeywordUseCaseParams } from './dtos/SearchVideoByKeywordUseCaseParams';
import { InvalidMaxResultsExceptions } from './exceptions/InvalidMaxResultsExceptions';
import { SearchVideoByKeywordUseCase } from './SearchVideoByKeywordUseCase';

@Injectable()
export class SearchVideoByKeywordUseCaseImpl
  implements SearchVideoByKeywordUseCase
{
  constructor(private readonly _youtubeProvider: YoutubeProvider) {}

  public async execute({
    keyword,
    maxResults,
    nextPageToken,
  }: SearchVideoByKeywordUseCaseParams): SearchVideoByKeywordResponse {
    this._validateMaxResults(maxResults);

    const searchResult = await this._youtubeProvider.searchByKeyword(
      keyword,
      maxResults,
      nextPageToken,
    );

    return searchResult;
  }

  private _validateMaxResults(maxResults: number) {
    if (maxResults <= 0) {
      throw new InvalidMaxResultsExceptions(maxResults);
    }
  }
}
