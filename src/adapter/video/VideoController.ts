import { Injectable, Query } from '@nestjs/common';
import { SearchVideoByKeywordResponse } from '../../domain/use-cases/video/response.index';
import { SearchVideoByKeywordUseCaseParams } from '../../domain/use-cases/video/search-video-by-keyword/dtos/SearchVideoByKeywordUseCaseParams';
import { SearchVideoByKeywordUseCase } from '../../domain/use-cases/video/search-video-by-keyword/SearchVideoByKeywordUseCase';

@Injectable()
export class VideoController {
  constructor(
    private readonly _searchVideoByKeywordUseCase: SearchVideoByKeywordUseCase,
  ) {}

  async searchVideoByKeyword(
    @Query('keyword') keyword: string,
    @Query('max') maxResults: number,
    @Query('next') nextPageToken?: string,
  ): SearchVideoByKeywordResponse {
    const input: SearchVideoByKeywordUseCaseParams = {
      keyword,
      maxResults,
      nextPageToken,
    };

    const response = await this._searchVideoByKeywordUseCase.execute(input);

    return response;
  }
}
