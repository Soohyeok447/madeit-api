import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InformationBoardController } from '../../../adapter/information-board/InformationBoardController';
import {
  GetPostResponse,
  GetPostsResponse,
} from '../../../domain/use-cases/information-board/response.index';
import { ValidateMongoObjectId } from '../../../adapter/common/validators/ValidateMongoObjectId';
import { GetPostResponseDto } from '../../../domain/use-cases/information-board/get-post/dtos/GetPostResponseDto';
import { GetPostsResponseDto } from '../../../domain/use-cases/information-board/get-posts/dtos/GetPostsResponseDto';

@ApiTags('꿀팁게시판 API')
@Controller('v1/info-boards')
export class InformationBoardControllerInjectedDecorator extends InformationBoardController {
  @ApiOperation({
    summary: '꿀팁게시판 게시글을 불러옵니다',
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
    summary: '꿀팁게시판 게시글 목록을 불러옵니다',
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
}
