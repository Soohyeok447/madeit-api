import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import {
  GetMainVersionResponse,
  VersionController,
} from '../../../adapter/version/VersionController';

@ApiTags('version check API')
@Controller('version')
export class VersionControllerInjectedDecorator extends VersionController {
  @ApiOperation({
    summary: '메인 버전 확인 API',
  })
  @ApiResponse({
    status: 200,
    description: `
    버전 확인 성공`,
    type: GetMainVersionResponse,
  })
  @Get('')
  getMainVersion(): GetMainVersionResponse {
    return super.getMainVersion();
  }
}
