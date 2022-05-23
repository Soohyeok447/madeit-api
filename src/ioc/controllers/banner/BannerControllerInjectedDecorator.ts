import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { BannerController } from '../../../adapter/banner/BannerController';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
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
    200, 401
    [에러코드]`,
  })
  @ApiResponse({
    status: 200,
    description: `
    불러온 배너`,
    type: GetBannerResponseDto,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
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
    200, 401
    [에러코드]`,
  })
  @ApiResponse({
    status: 200,
    description: `
    불러온 배너들`,
    isArray: true,
    type: GetBannersResponseDto,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async getBanners(): Promise<GetBannersResponseDto[]> {
    return super.getBanners();
  }
}
