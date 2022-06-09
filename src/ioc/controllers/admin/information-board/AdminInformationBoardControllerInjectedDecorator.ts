import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
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
// import { Request, Response } from 'express';
import { AddPostRequestDto } from '../../../../adapter/admin/information-board/add-post/AddPostRequestDto';
import { AdminInformationBoardController } from '../../../../adapter/admin/information-board/AdminInformationBoardController';
import { ModifyPostRequestDto } from '../../../../adapter/admin/information-board/modify-post/ModifyPostRequestDto';
import {
  UserAuth,
  UserPayload,
} from '../../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../../adapter/common/guards/JwtAuthGuard.guard';
import { CardnewsInterceptor } from '../../../../adapter/common/interceptors/image.interceptor';
import { ValidateMongoObjectId } from '../../../../adapter/common/validators/ValidateMongoObjectId';
import { MulterFile } from '../../../../domain/common/types';
import { AddPostResponseDto } from '../../../../domain/use-cases/information-board/add-post/dtos/AddPostResponseDto';
import { ModifyPostResponseDto } from '../../../../domain/use-cases/information-board/modify-post/dtos/ModifyPostResponseDto';
import {
  AddPostResponse,
  ModifyPostResponse,
  DeletePostResponse,
  PutCardnewsResponse,
} from '../../../../domain/use-cases/information-board/response.index';
import { SwaggerUserNotAdminException } from '../../information-board/swagger/SwaggerUserNotAdminException';

@ApiTags('어드민 꿀팁게시판 API')
@Controller('v1/admin/info-boards')
export class AdminInformationBoardControllerInjectedDecorator extends AdminInformationBoardController {
  @ApiOperation({
    summary: '[어드민] 꿀팁게시판에 게시글을 등록합니다',
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
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post()
  public async addPost(
    @UserAuth() user: UserPayload,
    @Body() body: AddPostRequestDto,
  ): AddPostResponse {
    return super.addPost(user, body);
  }

  @ApiOperation({
    summary: '[어드민] 꿀팁게시판 게시글을 수정합니다',
    description: `
    어드민 권한이 필요합니다.
    cardnews는 add이후 따로 
    post API를 사용해서 post해주세요
    

    [Request headers]
    api access token

    [Request path parameter]
    /:postId

    [Request body]
    - REQUIRED - 
    

    - OPTIONAL -
    String title
   
    [Response]
    200, 401, 404

    [에러코드]
    73 - 어드민이 아님
    79 - 게시글이 없음
    `,
  })
  @ApiBody({
    description: `
    정보게시판의 게시글을 위한 form data`,
    type: ModifyPostRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `
    게시글 수정 성공`,
    type: ModifyPostResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민이 아님`,
    type: SwaggerUserNotAdminException,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async modifyPost(
    @UserAuth() user: UserPayload,
    @Param('id', ValidateMongoObjectId) postId: string,
    @Body() body: ModifyPostRequestDto,
  ): ModifyPostResponse {
    return super.modifyPost(user, postId, body);
  }

  @ApiOperation({
    summary: '[어드민] 꿀팁게시판 게시글 삭제을 삭제합니다',
    description: `
    어드민 권한이 필요합니다.
    
    [Request headers]
    api access token

    [Request path parameter]
    /:postId

    [Request body]
    - REQUIRED - 
    

    - OPTIONAL -
   
    [Response]
    200, 401, 404

    [에러코드]
    73 - 어드민이 아님
    79 - 게시글이 없음
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    게시글 삭제 성공`,
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민이 아님`,
    type: SwaggerUserNotAdminException,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  public async deletePost(
    @UserAuth() user: UserPayload,
    @Param('id', ValidateMongoObjectId) postId: string,
  ): DeletePostResponse {
    return super.deletePost(user, postId);
  }

  @ApiOperation({
    summary: '[어드민] 게시글에 카드뉴스를 저장합니다',
    description: `
    어드민 권한이 필요합니다.

    multipart form형태의 cardnews를 키값으로 최대 10장 전송 가능
    파일명은 1부터 오름차순으로 직접 설정해서 보내주세요
    확장자 빼고 보내주세요
    ex) 1, 2

    [Request headers]
    api access token

    [Request path parameter]
    /:postId

    [Request query parameter]
    OPTIONAL String next - 페이징 토큰
    REQUIRED Int size - 불러올 리스트 사이즈

    [Request body]
    - REQUIRED - 
    cardnews 파일들

    
    - OPTIONAL -
   
    [Response]
    200, 401, 404

    [에러코드]
    73 - 어드민이 아님
    79 - 게시글이 없음
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    카드뉴스 저장 성공`,
    type: Object,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT')
  @UseInterceptors(CardnewsInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('/:id/cardnews')
  public async putCardnews(
    @UserAuth() user: UserPayload,
    @Param('id', ValidateMongoObjectId) postId: string,
    @UploadedFiles() cardnews: MulterFile[],
  ): PutCardnewsResponse {
    return super.putCardnews(user, postId, cardnews);
  }
}
