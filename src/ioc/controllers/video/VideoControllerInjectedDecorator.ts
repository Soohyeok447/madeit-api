import {
  ApiBearerAuth,
  ApiOperation,
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

    [Request body]
    - REQUIRED - 

    - OPTIONAL -

    [Response]
    200, 400, 404

    [에러코드]
    1 - 유효하지 않은 maxResults
    2 - 유튜브 검색 API의 일일 할당량을 초과했습니다. 내일 다시 시도해주세요. 빠른 시일내에 유튜브 할당량을 증가시키겠습니다.
    3 - 유효하지 않은 keyword (message: 유효하지 않은 요청입니다)
    4 - 연결 지연으로 검색에 실패했습니다. 잠시후 재시도해주세요.
    5 - 서버에서 Youtube API 인증에 문제가 생겼습니다. 빠른 시간내로 고치겠습니다.
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    유튜브 영상 검색 성공`,
    type: SearchVideoByKeywordResponseDto,
    isArray: true,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async searchVideoByKeyword(
    @Query('keyword') keyword: string,
    @Query('max') maxResults: number,
  ): SearchVideoByKeywordResponse {
    return super.searchVideoByKeyword(keyword, maxResults);
  }
}
