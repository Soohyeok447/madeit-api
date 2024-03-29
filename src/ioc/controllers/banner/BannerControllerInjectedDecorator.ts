import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BannerController } from '../../../adapter/banner/BannerController';
import { GetBannerResponseDto } from '../../../domain/use-cases/banner/get-banner/dtos/GetBannerResponseDto';
import { GetBannersResponseDto } from '../../../domain/use-cases/banner/get-banners/dtos/GetBannersResponseDto';

@ApiTags('배너 API')
@Controller('v1/banners')
export class BannerControllerInjectedDecorator extends BannerController {
  @ApiOperation({
    summary: '배너를 불러옵니다',
    description: `
    [path parameter]
    /:bannerId

    [Request body]
    - REQUIRED -
    
    - OPTIONAL -
    
    [Response]
    200,404

    [에러코드]
    88 - 배너가 없음
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    불러온 배너`,
    type: GetBannerResponseDto,
  })
  @Get('/:id')
  public async getBanner(@Req() req: Request): Promise<GetBannerResponseDto> {
    return super.getBanner(req);
  }

  @ApiOperation({
    summary: '배너들을 불러옵니다',
    description: `

    [Request body]
    - REQUIRED -
    
    - OPTIONAL -
    
    [Response]
    200, 404

    [에러코드]
    88 - 배너가 1개도 없음
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    불러온 배너들`,
    isArray: true,
    type: GetBannersResponseDto,
  })
  @Get('')
  public async getBanners(): Promise<GetBannersResponseDto[]> {
    return super.getBanners();
  }
}
