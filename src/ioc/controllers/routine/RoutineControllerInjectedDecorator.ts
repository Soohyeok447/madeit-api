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
import { User } from '../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { AddRoutineRequestDto } from '../../../adapter/routine/add-routine/AddRoutineRequestDto';
import { ModifyRoutineRequestDto } from '../../../adapter/routine/modify-routine/ModifyRoutineRequestDto';
import { AddRoutineResponseDto } from '../../../domain/use-cases/routine/add-routine/dtos/AddRoutineResponseDto';
import { GetRoutineResponseDto } from '../../../domain/use-cases/routine/get-routine/dtos/GetRoutineResponseDto';
import { ModifyRoutineResponseDto } from '../../../domain/use-cases/routine/modify-routine/dtos/ModifyRoutineResponseDto';
import {
  AddRoutineResponse,
  DeleteRoutineResponse,
  GetRoutineResponse,
  GetRoutinesResponse,
  ModifyRoutineResponse,
  ToggleActivationResponse,
} from '../../../domain/use-cases/routine/response.index';
import { RoutineController } from '../../../adapter/routine/RoutineController';
import { SwaggerConflictRoutineAlarmException } from './swagger/SwaggerConflictRoutineAlarmException';
import { SwaggerRoutineNotFoundException } from './swagger/SwaggerRoutineNotFoundException';
import {
  ValidateCustomDecorators,
  ValidateMongoObjectId,
} from '../../../adapter/common/validators/ValidateMongoObjectId';
import { SwaggerInvalidTimeException } from './swagger/SwaggerInvalidTimeException';
import { GetRoutinesResponseDto } from '../../../domain/use-cases/routine/get-routines/dtos/GetRoutinesResponseDto';

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
    type: AddRoutineResponseDto,
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
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  async addRoutine(
    @User() user,
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
    type: ModifyRoutineResponseDto,
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
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async modifyRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
    @Body() modifyRoutineRequest: ModifyRoutineRequestDto,
  ): ModifyRoutineResponse {
    return super.modifyRoutine(routineId, user, modifyRoutineRequest);
  }

  @ApiOperation({
    summary: '한 루틴의 상세정보를 얻는 API',
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
    type: GetRoutineResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: `
    routineId로 루틴을 찾지 못했을 때`,
    type: SwaggerRoutineNotFoundException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getRoutine(
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
    type: GetRoutinesResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: `
    routineId로 루틴을 찾지 못했을 때`,
    type: SwaggerRoutineNotFoundException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getRoutines(@User(ValidateCustomDecorators) user): GetRoutinesResponse {
    return super.getRoutines(user);
  }

  @ApiOperation({
    summary: '알람 활성/비활성화',
    description: `

    [Request headers]
    api access token

    [Request path parameter]
    toggle/:routineId

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
    활성/비활성화 토글 성공`,
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: `
    routineId로 루틴을 찾지 못했을 때`,
    type: SwaggerRoutineNotFoundException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Patch('/toggle/:id')
  @HttpCode(204)
  async toggleActivation(
    @Param('id', ValidateMongoObjectId) routineId: string,
    @User(ValidateCustomDecorators) user,
  ): ToggleActivationResponse {
    return super.toggleActivation(routineId, user);
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
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(200)
  async deleteRoutine(
    @Param('id', ValidateMongoObjectId) routineId: string,
  ): DeleteRoutineResponse {
    return super.deleteRoutine(routineId);
  }
}
