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
  Controller,
  Get,
} from '@nestjs/common';
import { SearchVideoByKeywordResponseDto } from '../../../domain/use-cases/video/search-video-by-keyword/dtos/SearchVideoByKeywordResponseDto';
import { GetMainVersionResponse, VersionController } from '../../../adapter/version/VersionController';

@ApiTags('version 관련 API')
@Controller('version')
export class VersionControllerInjectedDecorator extends VersionController {
  @ApiOperation({
    summary: '메인 버전 확인 API',
    description: `
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    버전 확인 성공`,
    type: SearchVideoByKeywordResponseDto
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @Get('')
  getMainVersion(): GetMainVersionResponse {
    return super.getMainVersion();
  }
}
