import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { AddRoutineRequestDto } from '../../../adapter/routine/add-routine/AddRoutineRequestDto';
import { AddRoutineResponseDto } from '../../../domain/use-cases/routine/add-routine/dtos/AddRoutineResponseDto';
import { RecommendedRoutineController } from '../../../adapter/recommended-routine/RecommendedRoutineController';
import { AddRecommendedRoutineResponse, ModifyRecommendedRoutineResponse } from '../../../domain/use-cases/recommended-routine/response.index';
import { AddRecommendedRoutineRequestDto } from '../../../adapter/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { AddRecommendedRoutineResponseDto } from '../../../domain/use-cases/recommended-routine/add-recommended-routine/dtos/AddRecommendedRoutineResponseDto';
import { SwaggerTitleConflictException } from './swagger/SwaggerTitleConflictException';
import { SwaggerUserNotAdminException } from './swagger/SwaggerUserNotAdminException';
import { ModifyRecommendedRoutineRequestDto } from '../../../adapter/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineRequestDto';
import { ValidateCustomDecorators, ValidateMongoObjectId } from '../../../adapter/common/validators/ValidateMongoObjectId';
import { ModifyRecommendedRoutineResponseDto } from '../../../domain/use-cases/recommended-routine/modify-recommended-routine/dtos/ModifyRecommendedRoutineResponseDto';

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

    [Request headers]
    api access token

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
    return super.modifyRecommendedRoutine(routineId, user, modifyRoutineRequest);
  }

  // @ApiOperation({
  //   summary: '한 루틴의 상세정보를 얻는 API',
  //   description: `
  //   [Request headers]
  //   api access token

  //   [Request path parameter]
  //   /:routineId

  //   [Request body]
  //   - REQUIRED - 

  //   - OPTIONAL -

  //   [Response]
  //   200, 404

  //   [에러코드]
  //   `,
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: `
  //   루틴 불러오기 성공`,
  //   type: GetRoutineResponseDto,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: `
  //   routineId로 루틴을 찾지 못했을 때`,
  //   type: SwaggerRoutineNotFoundException,
  // })
  // @ApiBearerAuth('accessToken | refreshToken')
  // @UseGuards(JwtAuthGuard)
  // @Get('/:id')
  // async getRoutine(
  //   @Param('id', ValidateMongoObjectId) routineId: string,
  // ): GetRoutineResponse {
  //   return super.getRoutine(routineId);
  // }

  // @ApiOperation({
  //   summary: '루틴들을 가져오는 API',
  //   description: `
  //   timeToRunAlarm은 second입니다.
  //   현재 문제가 있어서 timeToRunALarm 정상 동작안됨
  //   무조건 30을 return 하는 중

  //   [Request headers]
  //   api access token

  //   [Request body]
  //   - REQUIRED - 

  //   - OPTIONAL -

  //   [Response]
  //   200, 404

  //   [에러코드]
  //   `,
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: `
  //   루틴 불러오기 성공`,
  //   type: GetRoutinesResponseDto,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: `
  //   routineId로 루틴을 찾지 못했을 때`,
  //   type: SwaggerRoutineNotFoundException,
  // })
  // @ApiBearerAuth('accessToken | refreshToken')
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // async getRoutines(
  //   @User(ValidateCustomDecorators) user,
  // ): GetRoutinesResponse {
  //   return super.getRoutines(user);
  // }




  // @ApiOperation({
  //   summary: '알람 활성/비활성화',
  //   description: `

  //   [Request headers]
  //   api access token

  //   [Request path parameter]
  //   toggle/:routineId

  //   - REQUIRED - 

  //   - OPTIONAL -

  //   [Response]
  //   204, 404

  //   [에러코드]
  //   `,
  // })
  // @ApiResponse({
  //   status: 204,
  //   description: `
  //   활성/비활성화 토글 성공`,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: `
  //   routineId로 루틴을 찾지 못했을 때`,
  //   type: SwaggerRoutineNotFoundException,
  // })
  // @ApiBearerAuth('accessToken | refreshToken')
  // @UseGuards(JwtAuthGuard)
  // @Patch('/toggle/:id')
  // @HttpCode(204)
  // async toggleActivation(
  //   @Param('id', ValidateMongoObjectId) routineId: string,
  //   @User(ValidateCustomDecorators) user,
  // ): ToggleActivationResponse {
  //   return super.toggleActivation(routineId, user);
  // }
}
