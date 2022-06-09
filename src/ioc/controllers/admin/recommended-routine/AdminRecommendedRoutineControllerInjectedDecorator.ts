import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AddRecommendedRoutineRequestDto } from '../../../../adapter/admin/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { AdminRecommendedRoutineController } from '../../../../adapter/admin/recommended-routine/AdminRecommendedRoutineController';
import { ModifyRecommendedRoutineRequestDto } from '../../../../adapter/admin/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineRequestDto';
import {
  ThumbnailInterceptor,
  CardnewsInterceptor,
} from '../../../../adapter/common/interceptors/image.interceptor';
import { ValidateMongoObjectId } from '../../../../adapter/common/validators/ValidateMongoObjectId';
import { MulterFile } from '../../../../domain/common/types';
import { AddRecommendedRoutineResponseDto } from '../../../../domain/use-cases/admin/add-recommended-routine/dtos/AddRecommendedRoutineResponseDto';
import { DeleteRecommendedRoutineResponseDto } from '../../../../domain/use-cases/admin/delete-recommended-routine/dtos/DeleteRecommendedRoutineResponseDto';
import { ModifyRecommendedRoutineResponseDto } from '../../../../domain/use-cases/admin/modify-recommended-routine/dtos/ModifyRecommendedRoutineResponseDto';
import { PatchCardnewsResponseDto } from '../../../../domain/use-cases/admin/patch-cardnews/dtos/PatchCardnewsResponseDto';
import { PatchThumbnailResponseDto } from '../../../../domain/use-cases/admin/patch-thumbnail/dtos/PatchThumbnailResponseDto';
import { SwaggerUserNotAdminException } from '../../information-board/swagger/SwaggerUserNotAdminException';
import { SwaggerTitleConflictException } from '../../recommended-routine/swagger/SwaggerTitleConflictException';

@ApiTags('어드민 추천루틴 API')
@Controller('v1/admin/recommended-routines')
export class AdminRecommendedRoutineControllerInjectedDecorator extends AdminRecommendedRoutineController {
  @ApiOperation({
    summary: '[어드민] 추천 루틴을 등록합니다',
    description: `
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
    TimerDuration = 'TimerDuration',

    Enum Category
    Health = 'Health'
    Motivation = 'Motivation',
    Meditation = 'Meditation',
    Reading = 'Reading',
    Success = 'Success',
    SelfManagement = 'SelfManagement',

    [Request body]
    - REQUIRED - 
    String title
    Category category
    string introduction
    String contentVideoId


    - OPTIONAL -
    List<FixedField> fixedFields
    Int hour
    Int minute
    List<Int> days
    String alarmVideoId
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
  @Post('')
  public async addRecommendedRoutine(
    @Req() req: Request,
    @Body() addRecommendedRoutineRequest: AddRecommendedRoutineRequestDto,
  ): Promise<AddRecommendedRoutineResponseDto> {
    return super.addRecommendedRoutine(req, addRecommendedRoutineRequest);
  }

  @ApiOperation({
    summary: '[어드민] 추천 루틴을 수정합니다',
    description: `
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
    TimerDuration = 'TimerDuration',

    Enum Category
    Health = 'Health'
    Motivation = 'Motivation',
    Meditation = 'Meditation',
    Reading = 'Reading',
    Success = 'Success',
    SelfManagement = 'SelfManagement',
    
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
  @Patch('/:id')
  public async modifyRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @Body() modifyRoutineRequest: ModifyRecommendedRoutineRequestDto,
    @Req() req: Request,
  ): Promise<ModifyRecommendedRoutineResponseDto> {
    return super.modifyRecommendedRoutine(routineId, modifyRoutineRequest, req);
  }

  @ApiOperation({
    summary: '[어드민] 추천 루틴을 삭제합니다',
    description: `
  
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
  @Delete('/:id')
  @HttpCode(200)
  public async deleteRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @Req() req: Request,
  ): Promise<DeleteRecommendedRoutineResponseDto> {
    return super.deleteRecommendedRoutine(routineId, req);
  }

  @ApiOperation({
    summary: '[어드민] 추천 루틴의 썸네일을 수정합니다',
    description: `
    썸네일을 수정합니다.
    
    multipart form형태의 thumbnail을 키값으로 최대 1장 전송 가능

    [Request path parameter]
    /:recommendedRoutineId

    [Request body]
    - REQUIRED - 
    thumbnail 파일

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
  @UseInterceptors(ThumbnailInterceptor)
  @Patch('/:id/thumbnail')
  @HttpCode(200)
  public async patchThumbnail(
    @Param('id', ValidateMongoObjectId) recommendedRoutineId: string,
    @UploadedFile() thumbnail: MulterFile,
    @Req() req: Request,
  ): Promise<PatchThumbnailResponseDto> {
    return super.patchThumbnail(recommendedRoutineId, thumbnail, req);
  }

  @ApiOperation({
    summary: '[어드민] 추천 루틴의 카드뉴스를 수정합니다',
    description: `
    카드뉴스를 수정합니다.

    multipart form형태의 cardnews를 키값으로 최대 10장 전송 가능
    파일명은 1부터 오름차순으로 직접 설정해서 보내주세요
    확장자 빼고 보내주세요
    ex) 1, 2


    [Request path parameter]
    /:recommendedRoutineId

    [Request body]
    - REQUIRED - 
    cardnews 파일들

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
  @UseInterceptors(CardnewsInterceptor)
  @Patch('/:id/cardnews')
  @HttpCode(200)
  public async patchCardnews(
    @Param('id', ValidateMongoObjectId) recommendedRoutineId: string,
    @UploadedFiles() cardnews: MulterFile[],
    @Req() req: Request,
  ): Promise<PatchCardnewsResponseDto> {
    return super.patchCardnews(recommendedRoutineId, cardnews, req);
  }
}
