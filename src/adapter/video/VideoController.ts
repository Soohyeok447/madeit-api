import { Injectable, Query } from '@nestjs/common';
import { SearchVideoByKeywordResponse } from '../../domain/use-cases/video/response.index';
import { SearchVideoByKeywordResponseDto } from '../../domain/use-cases/video/search-video-by-keyword/dtos/SearchVideoByKeywordResponseDto';
import { SearchVideoByKeywordUseCaseParams } from '../../domain/use-cases/video/search-video-by-keyword/dtos/SearchVideoByKeywordUseCaseParams';
import { SearchVideoByKeywordUseCase } from '../../domain/use-cases/video/search-video-by-keyword/SearchVideoByKeywordUseCase';

@Injectable()
export class VideoController {
  public constructor(
    private readonly _searchVideoByKeywordUseCase: SearchVideoByKeywordUseCase,
  ) {}

  public async searchVideoByKeyword(
    @Query('keyword') keyword: string,
    @Query('max') maxResults: number,
  ): SearchVideoByKeywordResponse {
    const input: SearchVideoByKeywordUseCaseParams = {
      keyword,
      maxResults,
    };

    const response: SearchVideoByKeywordResponseDto[] =
      await this._searchVideoByKeywordUseCase.execute(input);

    return response;
  }
}
