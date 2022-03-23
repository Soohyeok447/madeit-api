/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { HtmlEntitiesProvider } from '../../../providers/HtmlEntitiesProvider';
import { YoutubeProvider } from '../../../providers/YoutubeProvider';
import { SearchVideoByKeywordResponse } from '../response.index';
import { SearchVideoByKeywordResponseDto } from './dtos/SearchVideoByKeywordResponseDto';
import { SearchVideoByKeywordUseCaseParams } from './dtos/SearchVideoByKeywordUseCaseParams';
import { InvalidKeywordException } from './exceptions/InvalidKeywordException';
import { InvalidMaxResultsExceptions } from './exceptions/InvalidMaxResultsExceptions';
import { SearchVideoByKeywordUseCase } from './SearchVideoByKeywordUseCase';

@Injectable()
export class SearchVideoByKeywordUseCaseImpl
  implements SearchVideoByKeywordUseCase
{
  constructor(
    private readonly _youtubeProvider: YoutubeProvider,
    private readonly _htmlEntitiesProvider: HtmlEntitiesProvider,
  ) {}

  public async execute({
    keyword,
    maxResults,
  }: SearchVideoByKeywordUseCaseParams): SearchVideoByKeywordResponse {
    if (maxResults <= 0) throw new InvalidMaxResultsExceptions(maxResults);

    if (!keyword) throw new InvalidKeywordException();

    const searchResult = await this._youtubeProvider.searchByKeyword(
      keyword,
      maxResults,
    );

    if (!searchResult.length) return [];

    const decodedSearchResult: SearchVideoByKeywordResponseDto[] =
      searchResult.map((e) => {
        const { title: _, ...others }: any = e;

        return {
          title: this._htmlEntitiesProvider.decodeHtmlEntities(e.title),
          ...others,
        };
      });

    return decodedSearchResult;
  }
}
