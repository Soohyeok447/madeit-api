import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VideoController } from '../../../adapter/video/VideoController';
import { ValidateMongoObjectId } from '../../../adapter/common/validators/ValidateMongoObjectId';
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
    duration은 시:분:초 string으로 되어있습니다.
    1분이면 1:0일걸요
    33초면 33

    [Request headers]
    api access token

    [Request path parameter]
    /:keyword

    [Request query parameter]
    REQUIRED Int maxResults - 최대 검색 수
    OPTIONAL string nextPageToken - 다음 검색 페이지 토큰

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
    type: SearchVideoByKeywordResponseDto
  })
  @ApiQuery({
    name:'nextPageToken',
    required: false
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Get('/:keyword')
  async searchVideoByKeyword(
    @Param('keyword') keyword: string,
    @Query('maxResults') maxResults: number,
    @Query('nextPageToken') nextPageToken?: string,
  ): SearchVideoByKeywordResponse {
    return super.searchVideoByKeyword(keyword, maxResults, nextPageToken);
  }
}
