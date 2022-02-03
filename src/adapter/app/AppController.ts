import { Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { SwaggerJwtException, SwaggerServerException } from 'src/ioc/controllers/SwaggerExceptions';


export class SwaggerApiTokenException implements SwaggerServerException {
  @ApiProperty({ description: '메시지', example: '유효하지 않은 API토큰' })
  public message: string;

  @ApiProperty({ description: '상태코드', example: 400 })
  public statusCode: number;

  @ApiProperty({ description: '에러종류', example: 'Bad Request' })
  public error: string;
}

@Controller('v1')
export class AppController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) { }


  @Get('/공통exception')
  @ApiTags('공통 exception')
  // @ApiResponse({
  //   status: 400,
  //   description: `
  //   유효하지 않은 API token을 전송했을 경우 (Sign In, Refresh 제외)`,
  //   type: SwaggerApiTokenException
  // })
  @ApiResponse({
    status: 401,
    description: `
    유효하지 않은 JWT(access, refresh)가 헤더에 포함돼있음 (Sign In만 제외)`,
    type: SwaggerJwtException,
  })
  exception() { }

  @Get('/health')
  @ApiTags('health check API')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
