import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { VideoController } from '../../../adapter/video/VideoController';
import { SearchVideoByKeywordResponse } from '../../../domain/use-cases/video/response.index';
import { SearchVideoByKeywordResponseDto } from '../../../domain/use-cases/video/search-video-by-keyword/dtos/SearchVideoByKeywordResponseDto';

@ApiTags('비디오 관련 API')
@Controller('v1/videos')
export class VideoControllerInjectedDecorator extends VideoController {
  /**
   * 유튜브 영상 검색 API
   */

  @ApiOperation({
    summary: '유튜브 검색 API',
    description: `
    [Request headers]
    api access token

    [Request query parameter]
    REQUIRED Int max - 최대 검색 수
    REQUIRED string keyword - 검색 키워드
    OPTIONAL string next - 다음 검색 페이지 토큰

    [Request body]
    - REQUIRED - 

    - OPTIONAL -

    [Response]
    200, 400, 404

    [에러코드]
    1 - 유효하지 않은 maxResults
    2 - youtube에서 video chart를 찾을 수 없음
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    유튜브 영상 검색 성공`,
    type: SearchVideoByKeywordResponseDto,
  })
  @ApiQuery({
    name: 'next',
    required: false,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Get('')
  async searchVideoByKeyword(
    @Query('keyword') keyword: string,
    @Query('max') maxResults: number,
    @Query('next') nextPageToken?: string,
  ): SearchVideoByKeywordResponse {
    return super.searchVideoByKeyword(keyword, maxResults, nextPageToken);
  }
}
