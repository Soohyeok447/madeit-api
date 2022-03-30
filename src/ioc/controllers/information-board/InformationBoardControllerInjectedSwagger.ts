import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAuth } from '../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { SwaggerUserNotAdminException } from './swagger/SwaggerUserNotAdminException';
import {
  CardnewsInterceptor,
  ThumbnailInterceptor,
} from '../../../adapter/common/interceptors/image.interceptor';
import { MulterFile } from '../../../domain/common/types';
import { InformationBoardController } from '../../../adapter/information-board/InformationBoardController';
import { AddPostResponse } from '../../../domain/use-cases/information-board/response.index';
import { AddPostUseCaseParams } from '../../../domain/use-cases/information-board/add-post/dtos/AddPostUseCaseParams';
import { AddPostResponseDto } from '../../../domain/use-cases/information-board/add-post/dtos/AddPostResponseDto';
import { AddPostRequestDto } from '../../../adapter/information-board/add-post/AddPostRequestDto';

@ApiTags('정보게시판 API')
@Controller('v1/info-boards')
export class InformationBoardControllerInjectedDecorator extends InformationBoardController {
  @ApiOperation({
    summary: '정보게시판 게시글 등록 API',
    description: `
    어드민 권한이 필요합니다.
    cardnews는 add이후 따로 
    post API를 사용해서 post해주세요
    

    [Request headers]
    api access token

    [Request body]
    - REQUIRED - 
    String title

    - OPTIONAL -
   
    [Response]
    201, 401

    [에러코드]
    73 - 어드민이 아님
    `,
  })
  @ApiBody({
    description: `
    정보게시판의 게시글을 위한 form data`,
    type: AddPostRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: `
    게시글 생성 성공`,
    type: AddPostResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민이 아님`,
    type: SwaggerUserNotAdminException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  async addBoard(
    @UserAuth() user,
    @Body() addInformationBoardRequest: AddPostRequestDto,
  ): AddPostResponse {
    return super.addBoard(user, addInformationBoardRequest);
  }
}
