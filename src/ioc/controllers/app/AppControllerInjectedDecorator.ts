import {
  Controller,
  Get,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppController } from '../../../adapter/app/AppController';
import { HealthCheck } from '@nestjs/terminus';
import { SwaggerUnauthorizationException } from './swagger/SwaggerUnauthorizationException';


@Controller('v1')
export class AppControllerInjectedDecorator extends AppController {
  @ApiOperation({
    summary: 'Unauthorization Exception',
    description: `
    errorCode 80 일 때만 sileent refresh 수행하면 됨
    (refresh token도 같은 에러코드를 사용합니다) 
    
    [에러코드]
    80 - 토큰 만료 
    81 - 유효하지 않은 서명
    82 - 토큰이 없음
    83 - 비정상적인 토큰
    84 - 유효하지 않은 토큰
    85 - info.message: String (처리 하지 못한 예외라 여러개가 뜰 수도 있음 결국 비정상적인 토큰이라는 점)
    90 - 유효하지 않은 issuer
    `,
  })
  @Get('-----------------------')
  @ApiTags('공통 exception')
  @ApiResponse({
    status: 401,
    description: `
    유효하지 않은 JWT(access, refresh)가 헤더에 포함돼있음 (Sign In만 제외)`,
    type: SwaggerUnauthorizationException,
  })
  exception() {
    return;
  }

  @Get('/health')
  @ApiTags('health check API')
  @HealthCheck()
  check() {
    return super.check();
  }
}
