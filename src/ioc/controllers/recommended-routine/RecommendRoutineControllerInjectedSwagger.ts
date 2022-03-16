import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
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
import { User } from '../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { RecommendedRoutineController } from '../../../adapter/recommended-routine/RecommendedRoutineController';
import {
  AddRecommendedRoutineResponse,
  DeleteRecommendedRoutineResponse,
  GetRecommendedRoutineResponse,
  GetRecommendedRoutinesByCategoryResponse,
  ModifyRecommendedRoutineResponse,
  PatchCardnewsResponse,
  PatchThumbnailResponse,
} from '../../../domain/use-cases/recommended-routine/response.index';
import { AddRecommendedRoutineRequestDto } from '../../../adapter/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { AddRecommendedRoutineResponseDto } from '../../../domain/use-cases/recommended-routine/add-recommended-routine/dtos/AddRecommendedRoutineResponseDto';
import { SwaggerTitleConflictException } from './swagger/SwaggerTitleConflictException';
import { SwaggerUserNotAdminException } from './swagger/SwaggerUserNotAdminException';
import { ModifyRecommendedRoutineRequestDto } from '../../../adapter/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineRequestDto';
import {
  ValidateCustomDecorators,
  ValidateMongoObjectId,
} from '../../../adapter/common/validators/ValidateMongoObjectId';
import { ModifyRecommendedRoutineResponseDto } from '../../../domain/use-cases/recommended-routine/modify-recommended-routine/dtos/ModifyRecommendedRoutineResponseDto';
import { SwaggerRoutineNotFoundException } from '../routine/swagger/SwaggerRoutineNotFoundException';
import { GetRecommendedRoutineResponseDto } from '../../../domain/use-cases/recommended-routine/get-recommended-routine/dtos/GetRecommendedRoutineResponseDto';
import { GetRecommendedRoutinesByCategoryResponseDto } from '../../../domain/use-cases/recommended-routine/get-recommended-routines-by-category/dtos/GetRecommendedRoutinesByCategoryResponseDto';
import {
  CardnewsInterceptor,
  ThumbnailInterceptor,
} from '../../../adapter/common/interceptors/image.interceptor';
import { MulterFile } from '../../../domain/common/types';

@ApiTags('추천 루틴 관련 API')
@Controller('v1/recommended-routines')
export class RecommendedRoutineControllerInjectedDecorator extends RecommendedRoutineController {
  @ApiOperation({
    summary: '추천 루틴 등록 API',
    description: `
    어드민 권한이 필요합니다.
    cardnews, thumbnail은 add이후 따로 
    patch API를 사용해서 patch해주세요
    
    fixedFields는 추천루틴이 장바구니에 담기고
    그 추천루틴으로 알람을 생성할 때를 위해
    고정 필드에 대한 정보를 가지고 있습니다.

    
    Enum FixedField
    Title = 'Title'
    Hour = 'Hour',
    Minute = 'Minute',
    Days = 'Days',
    AlarmVideoId = 'AlarmVideoId',
    ContentVideoId = 'ContentVideoId',
    TimeDuration = 'TimeDuration',

    Enum Category
    Health = 'Health'
    Motivation = 'Motivation',
    Meditation = 'Meditation',
    Reading = 'Reading',

    [Request headers]
    api access token

    [Request body]
    - REQUIRED - 
    String title
    Category category
    string introduction


    - OPTIONAL -
    List<FixedField> fixedFields
    Int hour
    Int minute
    List<Int> days
    String alarmVideoId
    String contentVideoId
    Int timerDuration
    Int price
    Int point
    Int exp


    [Response]
    201, 401, 409

    [에러코드]
    1 - 중복되는 추천 루틴 제목 존재
    73 - 어드민이 아님
    `,
  })
  @ApiBody({
    description: `
    추천 루틴 등록을 위한 form data`,
    type: AddRecommendedRoutineRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: `
    추천 루틴 생성 성공`,
    type: AddRecommendedRoutineResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민이 아님`,
    type: SwaggerUserNotAdminException,
  })
  @ApiResponse({
    status: 409,
    description: `
    중복된 추천 루틴 제목 존재`,
    type: SwaggerTitleConflictException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  async addRecommendedRoutine(
    @User() user,
    @Body() addRecommendedRoutineRequest: AddRecommendedRoutineRequestDto,
  ): AddRecommendedRoutineResponse {
    return super.addRecommendedRoutine(user, addRecommendedRoutineRequest);
  }

  @ApiOperation({
    summary: '추천 루틴 수정 API',
    description: `
    어드민 권한이 필요합니다.
    
    fixedFields는 추천루틴이 장바구니에 담기고
    그 추천루틴으로 알람을 생성할 때를 위해
    고정 필드에 대한 정보를 가지고 있습니다.

    
    Enum FixedFields
    Title = 'Title'
    Hour = 'Hour',
    Minute = 'Minute',
    Days = 'Days',
    AlarmVideoId = 'AlarmVideoId',
    ContentVideoId = 'ContentVideoId',
    TimeDuration = 'TimeDuration',

    Enum Category
    Health = 'Health'
    Motivation = 'Motivation',
    Meditation = 'Meditation',
    Reading = 'Reading',

    [Request headers]
    api access token

    [Request path parameter]
    /:routineId

    [Request body]
    - REQUIRED - 


    - OPTIONAL -
    String title
    Category category
    string introduction
    List<FixedField> fixedFields
    Int hour
    Int minute
    List<Int> days
    String alarmVideoId
    String contentVideoId
    Int timerDuration
    Int price
    Int point
    Int exp


    [Response]
    200, 401, 409

    [에러코드]
    1 - 중복되는 추천 루틴 제목 존재
    73 - 어드민이 아님
    `,
  })
  @ApiBody({
    description: `
    추천 루틴 수정을 위한 form data`,
    type: ModifyRecommendedRoutineRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `
    추천 루틴 수정 성공`,
    type: ModifyRecommendedRoutineResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민이 아님`,
    type: SwaggerUserNotAdminException,
  })
  @ApiResponse({
    status: 409,
    description: `
    중복된 추천 루틴 제목 존재`,
    type: SwaggerTitleConflictException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async modifyRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
    @Body() modifyRoutineRequest: ModifyRecommendedRoutineRequestDto,
  ): ModifyRecommendedRoutineResponse {
    return super.modifyRecommendedRoutine(
      routineId,
      user,
      modifyRoutineRequest,
    );
  }

  @ApiOperation({
    summary: '추천 루틴 삭제 API',
    description: `
    어드민 권한이 필요합니다.
    
    [Request headers]
    api access token

    [Request path parameter]
    /:routineId

    [Request body]
    - REQUIRED - 


    - OPTIONAL -


    [Response]
    200, 401, 404

    [에러코드]
    73 - 어드민이 아님
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    추천 루틴 삭제 성공`,
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민이 아님`,
    type: SwaggerUserNotAdminException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(200)
  async deleteRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
  ): DeleteRecommendedRoutineResponse {
    return super.deleteRecommendedRoutine(routineId, user);
  }

  @ApiOperation({
    summary: '한 추천 루틴의 상세정보를 얻는 API',
    description: `
    [Request headers]
    api access token

    [Request path parameter]
    /:routineId

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
    루틴 불러오기 성공`,
    type: GetRecommendedRoutineResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: `
    routineId로 루틴을 찾지 못했을 때`,
    type: SwaggerRoutineNotFoundException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @Get('/:id')
  async getRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
  ): GetRecommendedRoutineResponse {
    return super.getRecommendedRoutine(routineId);
  }

  @ApiOperation({
    summary: '추천 루틴 리스트 얻는 API',
    description: `
    [Request headers]
    api access token

    [Request query parameter]
    OPTIONAL String next - 페이징 토큰
    REQUIRED Int size - 불러올 리스트 사이즈
    REQUIRED Category category - 분류를 위한 카테고리

    [Request body]
    - REQUIRED - 

    - OPTIONAL -

    [Response]
    200, 404

    [에러코드]
    1 - 유효하지 않은 category입니다 (400)
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    추천 루틴 리스트 불러오기 성공`,
    type: GetRecommendedRoutinesByCategoryResponseDto,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @Get()
  async getRecommendedRoutinesByCategory(
    @Query() query,
  ): GetRecommendedRoutinesByCategoryResponse {
    return super.getRecommendedRoutinesByCategory(query);
  }

  @ApiOperation({
    summary: '추천 루틴의 썸네일 수정 API',
    description: `
    유저의 어드민권한 필요
    썸네일을 수정합니다.
    
    multipart form형태의 thumbnail을 키값으로 최대 1장 전송 가능

    [Request headers]
    api access token

    [Request path parameter]
    /:recommendedRoutineId

    [Request body]
    - REQUIRED - 

    - OPTIONAL -

    [Response]
    200, 401

    [에러코드]
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    썸네일 수정 성공`,
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민 권한이 없음`,
    type: SwaggerUserNotAdminException,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('accessToken | refreshToken')
  @UseInterceptors(ThumbnailInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/thumbnail')
  @HttpCode(200)
  async patchThumbnail(
    @Param('id', ValidateMongoObjectId) recommendedRoutineId: string,
    @User(ValidateCustomDecorators) user,
    @UploadedFile() thumbnail: MulterFile,
  ): PatchThumbnailResponse {
    return super.patchThumbnail(recommendedRoutineId, user, thumbnail);
  }

  @ApiOperation({
    summary: '추천 루틴의 카드뉴스 수정 API',
    description: `
    유저의 어드민권한 필요
    카드뉴스를 수정합니다.

    multipart form형태의 cardnews를 키값으로 최대 10장 전송 가능
    파일명은 1부터 오름차순으로 직접 설정해서 보내주세요
    ex) 1.jpg 2.jpg

    [Request headers]
    api access token

    [Request path parameter]
    /:routineId

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
    카드뉴스 수정 성공`,
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: `
    어드민 권한이 없음`,
    type: SwaggerUserNotAdminException,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('accessToken | refreshToken')
  @UseInterceptors(CardnewsInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/cardnews')
  @HttpCode(200)
  async patchCardnews(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
    @UploadedFiles() cardnews: MulterFile[],
  ): PatchCardnewsResponse {
    return super.patchCardnews(routineId, user, cardnews);
  }
}
