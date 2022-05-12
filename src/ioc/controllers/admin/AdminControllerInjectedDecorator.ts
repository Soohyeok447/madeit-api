import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
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
import { Request, Response } from 'express';
// import { RegisterAdminRequestDto } from '../../../adapter/admin/register-admin/RegisterAdminRequestDto';
// import { RegisterAdminResponseDto } from '../../../domain/use-cases/admin/register-admin/dtos/RegisterAdminResponseDto';
import { AdminController } from '../../../adapter/admin/AdminController';
import { IssueAdminTokenRequestDto } from '../../../adapter/admin/issue-admin-token/IssueAdminTokenRequestDto';
import {
  ThumbnailInterceptor,
  CardnewsInterceptor,
} from '../../../adapter/common/interceptors/image.interceptor';
import { ValidateMongoObjectId } from '../../../adapter/common/validators/ValidateMongoObjectId';
import { AddRecommendedRoutineRequestDto } from '../../../adapter/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { ModifyRecommendedRoutineRequestDto } from '../../../adapter/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineRequestDto';
import { MulterFile } from '../../../domain/common/types';
import { AnalyzeRoutinesUsageResponseDto } from '../../../domain/use-cases/admin/analyze-routines-usage/dtos/AnalyzeRoutinesUsageResponseDto';
import { CountUsersResponseDto } from '../../../domain/use-cases/admin/count-users/dtos/CountUsersResponseDto';
import { AddRecommendedRoutineResponseDto } from '../../../domain/use-cases/recommended-routine/add-recommended-routine/dtos/AddRecommendedRoutineResponseDto';
import { ModifyRecommendedRoutineResponseDto } from '../../../domain/use-cases/recommended-routine/modify-recommended-routine/dtos/ModifyRecommendedRoutineResponseDto';
import {
  AddRecommendedRoutineResponse,
  ModifyRecommendedRoutineResponse,
  DeleteRecommendedRoutineResponse,
  PatchThumbnailResponse,
  PatchCardnewsResponse,
} from '../../../domain/use-cases/recommended-routine/response.index';
import { SwaggerTitleConflictException } from '../recommended-routine/swagger/SwaggerTitleConflictException';
import { SwaggerUserNotAdminException } from '../recommended-routine/swagger/SwaggerUserNotAdminException';

@ApiTags('어드민 API')
@Controller('v1/admin')
export class AdminControllerInjectedDecorator extends AdminController {
  // @ApiOperation({
  //   summary: '[어드민] 어드민 가입 API',
  //   description: `

  //   [Request body]
  //   - REQUIRED -
  //   String id
  //   String password

  //   - OPTIONAL -

  //   [Response]
  //   201

  //   [에러코드]
  //   `,
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: `
  //   어드민 가입 성공`,
  //   type: RegisterAdminResponseDto,
  // })
  // @Post('/register')
  // public registerAdmin(
  //   @Body() { id, password }: RegisterAdminRequestDto,
  // ): Promise<RegisterAdminResponseDto> {
  //   return super.registerAdmin({
  //     id,
  //     password,
  //   });
  // }

  @ApiOperation({
    summary: '[어드민] 어드민토큰이 포함된 httpOnly 쿠키를 발급합니다',
    description: `
    [Request body]
    - REQUIRED - 
    String id
    String password

    - OPTIONAL -
   
    [Response]
    201, 401, 404

    [에러코드]
    86 - 존재하지 않는 어드민
    87 - 어드민 인증 실패
    `,
  })
  @ApiResponse({
    status: 201,
    description: `
    토큰 발급 성공`,
    type: Object,
  })
  @Post('/issue')
  public issueAdminToken(
    @Body() { id, password }: IssueAdminTokenRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Record<string, never>> {
    return super.issueAdminToken({ id, password }, res);
  }

  @ApiOperation({
    summary: '[어드민] 토큰을 재발급합니다',
    description: `
    리프레시 토큰 필요


    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    201, 404

    [에러코드]
    1 - 유효하지 않은 어드민 재발급 토큰
    86 - 존재하지 않는 어드민

    `,
  })
  @ApiResponse({
    status: 201,
    description: `
    토큰 재발급 성공`,
    type: Object,
  })
  @Post('/refresh')
  public refreshAdminToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<Record<string, never>> {
    return super.refreshAdminToken(res, req);
  }

  @ApiOperation({
    summary: '[어드민] 회원가입한 사용자 수를 불러옵니다',
    description: `
    admin token must be issued
    
    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    200, 404

    [에러코드]
    86 - 존재하지 않는 어드민
    87 - 유효하지 않은 어드민 토큰

    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    활성 사용자 수 불러오기 성공`,
    type: CountUsersResponseDto,
  })
  @Get('/count-users')
  public countUsers(@Req() req: Request): Promise<CountUsersResponseDto> {
    return super.countUsers(req);
  }

  @ApiOperation({
    summary: '[어드민] 최소 한개의 루틴을 생성한 사용자 수를 불러옵니다',
    description: `
    admin token must be issued

    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    200, 404

    [에러코드]
    86 - 존재하지 않는 어드민
    87 - 유효하지 않은 어드민 토큰

    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    최소 한개의 루틴을 생성한 사용자 수 불러오기 성공`,
    type: CountUsersResponseDto,
  })
  @Get('/count-users-added-one-routine')
  public countUsersAddedOneRoutine(
    @Req() req: Request,
  ): Promise<CountUsersResponseDto> {
    return super.countUsersAddedOneRoutine(req);
  }

  @ApiOperation({
    summary: '[어드민] 평균 루틴 생성, 삭제 수를 불러옵니다',
    description: `
    admin token must be issued

    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    200, 404

    [에러코드]
    86 - 존재하지 않는 어드민
    87 - 유효하지 않은 어드민 토큰

    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    평균 루틴 생성, 삭제 수를 불러오기 성공`,
    type: AnalyzeRoutinesUsageResponseDto,
  })
  @Get('/analyze-routines-usage')
  public analyzeRoutinesUsage(
    @Req() req: Request,
  ): Promise<AnalyzeRoutinesUsageResponseDto[]> {
    return super.analyzeRoutinesUsage(req);
  }

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
  @Post('/recommended-routines')
  public async addRecommendedRoutine(
    @Req() req: Request,
    @Body() addRecommendedRoutineRequest: AddRecommendedRoutineRequestDto,
  ): AddRecommendedRoutineResponse {
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
  @Patch('/recommended-routines/:id')
  public async modifyRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @Body() modifyRoutineRequest: ModifyRecommendedRoutineRequestDto,
    @Req() req: Request,
  ): ModifyRecommendedRoutineResponse {
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
  @Delete('/recommended-routines/:id')
  @HttpCode(200)
  public async deleteRecommendedRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @Req() req: Request,
  ): DeleteRecommendedRoutineResponse {
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
  @Patch('/recommended-routines/:id/thumbnail')
  @HttpCode(200)
  public async patchThumbnail(
    @Param('id', ValidateMongoObjectId) recommendedRoutineId: string,
    @UploadedFile() thumbnail: MulterFile,
    @Req() req: Request,
  ): PatchThumbnailResponse {
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
  @Patch('/recommended-routines/:id/cardnews')
  @HttpCode(200)
  public async patchCardnews(
    @Param('id', ValidateMongoObjectId) recommendedRoutineId: string,
    @UploadedFiles() cardnews: MulterFile[],
    @Req() req: Request,
  ): PatchCardnewsResponse {
    return super.patchCardnews(recommendedRoutineId, cardnews, req);
  }
}
