import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { AlarmController } from '../../../adapter/alarm/AlarmController';
import { AddAlarmRequestDto } from '../../../adapter/alarm/add-alarm/AddAlarmRequestDto';
import { UpdateAlarmRequestDto } from '../../../adapter/alarm/update-alarm/UpdateAlarmRequestDto';
import {
  AddAlarmResponse,
  DeleteAlarmResponse,
  GetAlarmResponse,
  GetAllAlarmsResponse,
  UpdateAlarmResponse,
} from '../../../domain/use-cases/alarm/response.index';
import { GetAlarmResponseDto } from '../../../domain/use-cases/alarm/get-alarm/dtos/GetAlarmResponseDto';
import { GetAllAlarmsResponseDto } from '../../../domain/use-cases/alarm/get-all-alarms/dtos/GetAllAlarmsResponseDto';
import { SwaggerAlarmConflictException } from './swagger/SwaggerAlarmConflictException';
import { SwaggerInvalidTimeException } from './swagger/SwaggerInvalidTimeException';
import { SwaggerAlarmNotFoundException } from './swagger/SwaggerAlarmNotFoundException';

@ApiTags('알람 관련 API')
@Controller('v1/alarms')
export class AlarmControllerInjectedDecorator extends AlarmController {
  @ApiOperation({
    summary: '알람 추가 API',
    description: `
    알람을 추가합니다`,
  })
  @ApiBody({
    description: `
    알람을 추가하기 위한 alarm request dto
    ex) 오후 1시 -> 1300`,
    type: AddAlarmRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: `
    알람 추가 성공`, //TODO alarm repository create 객체 리턴하도록 수정 하고 여기에 추가
  })
  @ApiResponse({
    status: 409,
    description: `
    시간이 중복되는 알람 추가 시도 시`,
    type: SwaggerAlarmConflictException,
  })
  @ApiResponse({
    status: 400,
    description: `
    유효하지 않은 시간으로 요청을 보냈을 시`,
    type: SwaggerInvalidTimeException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  async addAlarm(
    @User() user,
    @Body() addAlarmRequest: AddAlarmRequestDto,
  ): AddAlarmResponse {
    return super.addAlarm(user, addAlarmRequest);
  }

  @ApiOperation({
    summary: '알람 수정 API',
    description: `
    알람Id를 키로 알람을 수정합니다`,
  })
  @ApiBody({
    description: `
    알람을 수정하기 위한 alarm request dto
    ex) 오후 1시 -> 1300`,
    type: UpdateAlarmRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: `
    알람 수정 성공`,
  })
  @ApiResponse({
    status: 409,
    description: `
    시간이 중복되는 알람 추가 시도 시`,
    type: SwaggerAlarmConflictException,
  })
  @ApiResponse({
    status: 404,
    description: `
    수정할 알람이 없음`,
    type: SwaggerAlarmNotFoundException,
  })
  @ApiResponse({
    status: 400,
    description: `
    유효하지 않은 시간으로 요청을 보냈을 시`,
    type: SwaggerInvalidTimeException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateAlarm(
    @User() user,
    @Param('id') alarmId: string,
    @Body() updateAlarmRequest: UpdateAlarmRequestDto,
  ): UpdateAlarmResponse {
    return super.updateAlarm(user, alarmId, updateAlarmRequest);
  }

  @ApiOperation({
    summary: '세부 알람 정보 가져오기 API',
    description: `
    알람id를 키로 세부 알람정보를 받습니다`,
  })
  @ApiResponse({
    status: 200,
    description: `
    알람 가져오기 성공`,
    type: GetAlarmResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: `
    알람이 없음`,
    type: SwaggerAlarmNotFoundException,
  })
  // @ApiResponse({ //TODO 이거 모든 id가 주어지는 request dto에서 class validator로 해두자 
  //   status: 400,
  //   description: `
  //   잘못된 objectId (id는 무조건 24자)`,
  //   type: SwaggerServerException,
  // })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getAlarm(@User() user, @Param('id') alarmId: string): GetAlarmResponse {
    return super.getAlarm(user, alarmId);
  }

  @ApiOperation({
    summary: '알람 삭제 API',
    description: `
    알람id를 키로 알람을 삭제합니다`,
  })
  @ApiResponse({
    status: 200,
    description: `
    알람 삭제 성공`,
  })
  @ApiResponse({
    status: 404,
    description: `
    알람이 없음`,
    type: SwaggerAlarmNotFoundException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteAlarm(
    @User() user,
    @Param('id') alarmId: string,
  ): DeleteAlarmResponse {
    return super.deleteAlarm(user, alarmId);
  }

  @ApiOperation({
    summary: '유저의 모든 알람 가져오는 API',
    description: `
    유저의 모든 알람을 가져옵니다`,
  })
  @ApiResponse({
    status: 200,
    description: `
    알람 목록 가져오기 성공`,
    type: GetAllAlarmsResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: `
    알람이 없음`,
    type: SwaggerAlarmNotFoundException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllAlarms(@User() user): GetAllAlarmsResponse {
    return super.getAllAlarms(user);
  }
}
