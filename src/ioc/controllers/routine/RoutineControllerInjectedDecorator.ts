import {
  Body,
  Controller,
  Delete,
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
import {
  UserAuth,
  UserPayload,
} from '../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { AddRoutineRequestDto } from '../../../adapter/routine/add-routine/AddRoutineRequestDto';
import { ModifyRoutineRequestDto } from '../../../adapter/routine/modify-routine/ModifyRoutineRequestDto';
import {
  ActivateRoutineResponse,
  AddRoutineResponse,
  DeleteRoutineResponse,
  GetRoutineResponse,
  GetRoutinesResponse,
  ModifyRoutineResponse,
  InactivateRoutineResponse,
  DoneRoutineResponse,
} from '../../../domain/use-cases/routine/response.index';
import { RoutineController } from '../../../adapter/routine/RoutineController';
import { SwaggerConflictRoutineAlarmException } from './swagger/SwaggerConflictRoutineAlarmException';
import { SwaggerRoutineNotFoundException } from './swagger/SwaggerRoutineNotFoundException';
import {
  ValidateCustomDecorators,
  ValidateMongoObjectId,
} from '../../../adapter/common/validators/ValidateMongoObjectId';
import { SwaggerInvalidTimeException } from './swagger/SwaggerInvalidTimeException';
import { SwaggerRoutineAlreadyInactivatedException } from './swagger/SwaggerRoutineAlreadyInactivatedException';
import { SwaggerRoutineAlreadyActivatedException } from './swagger/SwaggerRoutineAlreadyActivatedException';
import { CommonRoutineResponseDto } from '../../../domain/use-cases/routine/common/CommonRoutineResponseDto';

@ApiTags('루틴 관련 API')
@Controller('v1/routines')
export class RoutineControllerInjectedDecorator extends RoutineController {
  @ApiOperation({
    summary: '루틴 등록 API',
    description: `
    hour 0 ~ 23
    minute 0 ~ 59

    alarmVideoId, contentVideoId, timerDuration 필드는
    request body에 값이 포함되지 않을 경우 null로 반환이 됩니다.

    [Request headers]
    api access token

    [Request body]
    - REQUIRED - 
    String title
    Int hour
    Int minute
    List<Int> days

    - OPTIONAL -
    String alarmVideoId
    String contentVideoId
    Int timerDuration
    String recommendedRoutineId

    [Response]
    201, 400, 409

    [에러코드]
    1 - 유효하지 않은 time (400)
    2 - 중복된 알람 (409)
    `,
  })
  @ApiBody({
    description: `
    루틴 등록을 위한 form data`,
    type: AddRoutineRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: `
    루틴 생성 성공`,
    type: CommonRoutineResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: `
    유효하지않은 hour or minute`,
    type: SwaggerInvalidTimeException,
  })
  @ApiResponse({
    status: 409,
    description: `
    중복된 알람 존재`,
    type: SwaggerConflictRoutineAlarmException,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post()
  public async addRoutine(
    @UserAuth() user: UserPayload,
    @Body() addRoutineRequest: AddRoutineRequestDto,
  ): AddRoutineResponse {
    return super.addRoutine(user, addRoutineRequest);
  }

  @ApiOperation({
    summary: '루틴 수정 API',
    description: `
    hour 0 ~ 23
    minute 0 ~ 59

    alarmVideoId, contentVideoId, timerDuration 필드는
    request body에 값이 포함되지 않을 경우 null로 반환이 됩니다.

    [Request headers]
    api access token

    [Request body]
    - REQUIRED - 

    - OPTIONAL -
    String title
    Int hour
    Int minute
    List<Int> days
    String alarmVideoId
    String contentVideoId
    Int timerDuration

    [Response]
    200, 400, 409

    [에러코드]
    1 - 유효하지 않은 time (400)
    2 - 중복된 알람 (409)
    `,
  })
  @ApiBody({
    description: `
    루틴 수정을 위한 form data`,
    type: ModifyRoutineRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `
    루틴 수정 성공`,
    type: CommonRoutineResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: `
    유효하지않은 hour or minute`,
    type: SwaggerInvalidTimeException,
  })
  @ApiResponse({
    status: 409,
    description: `
    중복된 알람 존재`,
    type: SwaggerConflictRoutineAlarmException,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  public async modifyRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
    @Body() modifyRoutineRequest: ModifyRoutineRequestDto,
  ): ModifyRoutineResponse {
    return super.modifyRoutine(routineId, user, modifyRoutineRequest);
  }

  @ApiOperation({
    summary: '한 루틴의 상세정보를 얻는 API',
    description: `
    Enum FixedField
    Title = 'Title'
    Hour = 'Hour',
    Minute = 'Minute',
    Days = 'Days',
    AlarmVideoId = 'AlarmVideoId',
    ContentVideoId = 'ContentVideoId',
    TimeDuration = 'TimeDuration',

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
    type: CommonRoutineResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: `
    routineId로 루틴을 찾지 못했을 때`,
    type: SwaggerRoutineNotFoundException,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async getRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
  ): GetRoutineResponse {
    return super.getRoutine(routineId);
  }

  @ApiOperation({
    summary: '루틴들을 가져오는 API',
    description: `
    [Request headers]
    api access token

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
    type: CommonRoutineResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: `
    routineId로 루틴을 찾지 못했을 때`,
    type: SwaggerRoutineNotFoundException,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getRoutines(
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
  ): GetRoutinesResponse {
    return super.getRoutines(user);
  }

  @ApiOperation({
    summary: '알람 활성화',
    description: `

    [Request headers]
    api access token

    [Request path parameter]
    /:routineId/activate

    - REQUIRED - 

    - OPTIONAL -

    [Response]
    200, 404, 409

    [에러코드]
    1 - 이미 활성화된 루틴
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    알람 활성화 성공`,
    type: CommonRoutineResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: `
    routineId로 루틴을 찾지 못했을 때`,
    type: SwaggerRoutineNotFoundException,
  })
  @ApiResponse({
    status: 409,
    description: `
    이미 활성화상태인데 활성화 API호출 시`,
    type: SwaggerRoutineAlreadyActivatedException,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/activate')
  @HttpCode(200)
  public async activateRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
  ): ActivateRoutineResponse {
    return super.activateRoutine(routineId, user);
  }

  @ApiOperation({
    summary: '알람 비활성화',
    description: `

    [Request headers]
    api access token

    [Request path parameter]
    /:routineId/inactivate

    - REQUIRED - 

    - OPTIONAL -

    [Response]
    200, 404, 409

    [에러코드]
    1 - 이미 비활성화된 루틴
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    알람 비활성화 성공`,
    type: CommonRoutineResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: `
    routineId로 루틴을 찾지 못했을 때`,
    type: SwaggerRoutineNotFoundException,
  })
  @ApiResponse({
    status: 409,
    description: `
    이미 비활성화상태인데 비활성화 API호출 시`,
    type: SwaggerRoutineAlreadyInactivatedException,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/inactivate')
  @HttpCode(200)
  public async inactivateRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
  ): InactivateRoutineResponse {
    return super.inactivateRoutine(routineId, user);
  }

  @ApiOperation({
    summary: '루틴 삭제 API',
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
    루틴 삭제 성공`,
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: `
    routineId로 루틴을 찾지 못했을 때`,
    type: SwaggerRoutineNotFoundException,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(200)
  public async deleteRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
  ): DeleteRoutineResponse {
    return super.deleteRoutine(routineId);
  }

  @ApiOperation({
    summary: '루틴 완료 API',
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
    3 - 포인트를 얻을 수 없는 루틴입니다
    4 - 일일 적립 포인트 한도 초과
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    루틴 완료 API 호출 성공`,
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: `
    routineId로 루틴을 찾지 못했을 때`,
    type: SwaggerRoutineNotFoundException,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/done')
  @HttpCode(200)
  public async doneRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @UserAuth(ValidateCustomDecorators) user: UserPayload,
  ): DoneRoutineResponse {
    return super.doneRoutine(routineId, user);
  }
}
