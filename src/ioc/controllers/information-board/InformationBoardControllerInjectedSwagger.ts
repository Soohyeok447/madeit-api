/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
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
import {
  UserAuth,
  UserPayload,
} from '../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { SwaggerUserNotAdminException } from './swagger/SwaggerUserNotAdminException';
import {
  CardnewsInterceptor,
  ThumbnailInterceptor,
} from '../../../adapter/common/interceptors/image.interceptor';
import { MulterFile } from '../../../domain/common/types';
import { InformationBoardController } from '../../../adapter/information-board/InformationBoardController';
import {
  AddPostResponse,
  DeletePostResponse,
  GetPostResponse,
  GetPostsResponse,
  ModifyPostResponse,
  PutCardnewsResponse,
} from '../../../domain/use-cases/information-board/response.index';
import { AddPostUseCaseParams } from '../../../domain/use-cases/information-board/add-post/dtos/AddPostUseCaseParams';
import { AddPostResponseDto } from '../../../domain/use-cases/information-board/add-post/dtos/AddPostResponseDto';
import { AddPostRequestDto } from '../../../adapter/information-board/add-post/AddPostRequestDto';
import { ModifyPostRequestDto } from '../../../adapter/information-board/modify-post/ModifyPostRequestDto';
import { ValidateMongoObjectId } from '../../../adapter/common/validators/ValidateMongoObjectId';
import { ModifyPostResponseDto } from '../../../domain/use-cases/information-board/modify-post/dtos/ModifyPostResponseDto';
import { GetPostResponseDto } from '../../../domain/use-cases/information-board/get-post/dtos/GetPostResponseDto';
import { GetPostsResponseDto } from '../../../domain/use-cases/information-board/get-posts/dtos/GetPostsResponseDto';

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
    summary: '정보게시판 게시글 수정 API',
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
    summary: '정보게시판 게시글 삭제 API',
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
    summary: '정보게시판 게시글 읽기 API',
    description: `
    [Request path parameter]
    /:postId

    [Request body]
    - REQUIRED - 
    

    - OPTIONAL -
   
    [Response]
    200, 404

    [에러코드]
    79 - 게시글이 없음
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    게시글 읽기 성공`,
    type: GetPostResponseDto,
  })
  @Get('/:id')
  public async getPost(
    @Param('id', ValidateMongoObjectId) postId: string,
  ): GetPostResponse {
    return super.getPost(postId);
  }

  @ApiOperation({
    summary: '정보게시판 게시글 목록 읽기 API',
    description: `
    [Request query parameter]
    OPTIONAL String next - 페이징 토큰
    REQUIRED Int size - 불러올 리스트 사이즈

    [Request body]
    - REQUIRED - 
    
    - OPTIONAL -
   
    [Response]
    200, 404

    [에러코드]
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    게시글 목록 읽기 성공`,
    type: [GetPostsResponseDto],
  })
  @Get('')
  public async getPosts(@Query() query: any): GetPostsResponse {
    return super.getPosts(query);
  }

  @ApiOperation({
    summary: '게시글에 카드뉴스 저장 API',
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
