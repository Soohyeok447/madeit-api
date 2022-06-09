import { Body, Controller, Delete, Patch, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AddBannerRequestDto } from '../../../../adapter/admin/banner/add-banner/AddBannerRequestDto';
import { AdminBannerController } from '../../../../adapter/admin/banner/AdminBannerController';
import { ModifyBannerRequestDto } from '../../../../adapter/admin/banner/modify-banner/ModifyBannerRequestDto';
import { AddBannerResponseDto } from '../../../../domain/use-cases/admin/add-banner/dtos/AddBannerResponseDto';
import { DeleteBannerResponseDto } from '../../../../domain/use-cases/admin/delete-banner/dtos/DeleteBannerResponseDto';
import { ModifyBannerResponseDto } from '../../../../domain/use-cases/admin/modify-banner/dtos/ModifyBannerResponseDto';
import { SwaggerUserNotAdminException } from '../../information-board/swagger/SwaggerUserNotAdminException';

@ApiTags('어드민 배너 API')
@Controller('v1/admin/banner')
export class AdminBannerControllerInjectedDecorator extends AdminBannerController {
  @ApiOperation({
    summary: '[어드민] 배너를 등록합니다',
    description: `
    [Request body]
    - REQUIRED - 
    String title
    String contentVideoId
    String bannerImageId

    - OPTIONAL -

    [Response]
    201, 401

    [에러코드]`,
  })
  @ApiResponse({
    status: 201,
    description: `
    배너등록 성공`,
    type: AddBannerResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민 권한이 없음`,
    type: SwaggerUserNotAdminException,
  })
  @Post('')
  public async addBanner(
    @Body() reqBody: AddBannerRequestDto,
    @Req() req: Request,
  ): Promise<AddBannerResponseDto> {
    return super.addBanner(reqBody, req);
  }

  @ApiOperation({
    summary: '[어드민] 배너를 수정합니다',
    description: `
    [path parameter]
    /:bannerId

    [Request body]
    - REQUIRED - 
    String title
    String contentVideoId
    String bannerImageId

    - OPTIONAL -

    [Response]
    201, 401

    [에러코드]
    88 - 배너가 존재하지 않음
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    배너수정 성공`,
    type: ModifyBannerResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민 권한이 없음`,
    type: SwaggerUserNotAdminException,
  })
  @Patch('/:id')
  public async modifyBanner(
    @Body() reqBody: ModifyBannerRequestDto,
    @Req() req: Request,
  ): Promise<ModifyBannerResponseDto> {
    return super.modifyBanner(reqBody, req);
  }

  @ApiOperation({
    summary: '[어드민] 배너를 삭제합니다',
    description: `
    [path parameter]
    /:bannerId

    [Request body]
    - REQUIRED - 

    - OPTIONAL -

    [Response]
    201, 401

    [에러코드]
    88 - 배너가 존재하지 않음
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    배너수정 성공`,
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민 권한이 없음`,
    type: SwaggerUserNotAdminException,
  })
  @Delete('/:id')
  public async deleteBanner(
    @Req() req: Request,
  ): Promise<DeleteBannerResponseDto> {
    return super.deleteBanner(req);
  }
}
