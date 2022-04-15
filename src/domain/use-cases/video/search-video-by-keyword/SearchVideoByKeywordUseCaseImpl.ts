/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { HtmlEntitiesProvider } from '../../../providers/HtmlEntitiesProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import {
  CallVideosApiResult,
  YoutubeProvider,
} from '../../../providers/YoutubeProvider';
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
  public constructor(
    private readonly _youtubeProvider: YoutubeProvider,
    private readonly _htmlEntitiesProvider: HtmlEntitiesProvider,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    keyword,
    maxResults,
  }: SearchVideoByKeywordUseCaseParams): SearchVideoByKeywordResponse {
    this._logger.setContext('SearchVideoByKeyword');

    if (maxResults <= 0) {
      throw new InvalidMaxResultsExceptions(
        maxResults,
        this._logger.getContext(),
        `maxResults가 0보다 작은 값으로 API 호출.`,
      );
    }

    if (!maxResults) {
      throw new InvalidMaxResultsExceptions(
        maxResults,
        this._logger.getContext(),
        `maxResults없이 API 호출.`,
      );
    }

    if (!keyword) {
      throw new InvalidKeywordException(
        this._logger.getContext(),
        `keyword없이 API 호출.`,
      );
    }

    const searchResult: CallVideosApiResult[] =
      await this._youtubeProvider.searchByKeyword(keyword, maxResults);

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
