import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BannerController } from '../../../adapter/banner/ImageController';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { AddImageByUserResponseDto } from '../../../domain/use-cases/image/add-image-by-user/dtos/AddImageByUserResponseDto';

@ApiTags('배너 API')
@Controller('v1/banner')
export class BannerControllerInjectedDecorator extends BannerController {
  // @ApiOperation({
  //   summary: '이미지를 추가하고 id를 반환받습니다',
  //   description: `
  //   [multipart/form]
  //   image - file
  //   description? - string
  //   [Request body]
  //   - REQUIRED -
  //   - OPTIONAL -
  //   [Response]
  //   201, 401
  //   [에러코드]`,
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: `
  //   이미지 등록 성공`,
  //   type: AddImageByUserResponseDto,
  // })
  // @ApiBearerAuth('JWT')
  // @UseGuards(JwtAuthGuard)
  // @Post('')
  // public async addImageByUser(
  //   @UploadedFile() image: Express.Multer.File,
  //   @Body() body?: object,
  // ): Promise<AddImageByUserResponseDto> {
  //   return super.addImageByUser(image, body);
  // }
}
