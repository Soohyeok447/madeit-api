import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { ImageInterceptor } from '../../../adapter/common/interceptors/image.interceptor';
import { ImageController } from '../../../adapter/image/ImageController';
import { AddImageByUserResponseDto } from '../../../domain/use-cases/image/add-image-by-user/dtos/AddImageByUserResponseDto';

@ApiTags('이미지 API')
@Controller('v1/image')
export class ImageControllerInjectedDecorator extends ImageController {
  @ApiOperation({
    summary: '이미지를 추가하고 id를 반환받습니다',
    description: `
    [multipart/form]
    image - file
    description? - string

    [Request body]
    - REQUIRED - 

    - OPTIONAL -

    [Response]
    201, 401

    [에러코드]`,
  })
  @ApiResponse({
    status: 201,
    description: `
    이미지 등록 성공`,
    type: AddImageByUserResponseDto,
  })
  @ApiBearerAuth('JWT')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(ImageInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async addImageByUser(
    @UploadedFile() image: Express.Multer.File,
    @Body() body?: object,
  ): Promise<AddImageByUserResponseDto> {
    return super.addImageByUser(image, body);
  }
}
