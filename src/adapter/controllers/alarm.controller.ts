import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AlarmService } from 'src/domain/alarm/service/interface/alarm.service';
import { AddAlarmInput } from 'src/domain/alarm/use-cases/add-alarm/dtos/add_alarm.input';
import { DeleteAlarmInput } from 'src/domain/alarm/use-cases/delete-alarm/dtos/delete_alarm.input';
import { GetAllAlarmsInput } from 'src/domain/alarm/use-cases/get-all-alarms/dtos/get_all_alarms.input';
import { GetAllAlarmsOutput } from 'src/domain/alarm/use-cases/get-all-alarms/dtos/get_all_alarms.output';
import { GetAlarmInput } from 'src/domain/alarm/use-cases/get-alarm/dtos/get_alarm.input';
import { GetAlarmOutput } from 'src/domain/alarm/use-cases/get-alarm/dtos/get_alarm.output';
import { UpdateAlarmInput } from 'src/domain/alarm/use-cases/update-alarm/dtos/update_alarm.input';

import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../common/swagger.dto';
import { AddAlarmRequest } from '../dto/alarm/add_alarm.request';
import { UpdateAlarmRequest } from '../dto/alarm/update_alarm.request';


@Controller('v1')
@ApiTags('알람 관련 API')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) { }

  @Post('users/me/alarm')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '알람 추가 API',
    description: '알람을 추가합니다.',
  })
  @ApiBody({
    description: '알람을 추가하기 위한 alarm request dto',
    type: AddAlarmRequest,
  })
  @ApiResponse({
    status: 201,
    description: '알람 추가 성공',
  })
  @ApiResponse({
    status: 409,
    description:
      '시간이 중복되는 알람 추가 시도 시 <br/>ex)[friday,monday] 1230 중복',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 400,
    description:
      '유효하지 않은 시간으로 요청을 보냈을 시 <br/> ex)유효하지않은 time 123<br/><br/> 잘못된 objectId (id는 무조건 24자)',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async addAlarm(
    @User() user,
    @Body() addAlarmRequest: AddAlarmRequest,
  ): Promise<void> {
 

    const input: AddAlarmInput = {
      userId: user.id,
      ...addAlarmRequest,
    };

    await this.alarmService.addAlarm(input);
  }

  @Put('users/me/alarm/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '알람 수정 API',
    description: '알람을 수정합니다.',
  })
  @ApiBody({
    description: '알람을 수정하기 위한 alarm request dto',
    type: UpdateAlarmRequest,
  })
  @ApiResponse({
    status: 201,
    description: '알람 수정 성공',
  })
  @ApiResponse({
    status: 409,
    description:
      '시간이 중복되는 알람 추가 시도 시 <br/>ex)[friday,monday] 1230 중복',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 404,
    description: '수정할 알람이 없음',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 400,
    description:
      '유효하지 않은 시간으로 요청을 보냈을 시 <br/> ex)유효하지않은 time 123 <br/><br/> 잘못된 objectId (id는 무조건 24자)',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async updateAlarm(
    @User() user,
    @Param('id') alarmId: string,
    @Body() updateAlarmRequest: UpdateAlarmRequest,
  ): Promise<void> {
    const input: UpdateAlarmInput = {
      userId: user.id,
      alarmId,
      ...updateAlarmRequest,
    };

    await this.alarmService.updateAlarm(input);
  }

  @Get('users/me/alarm/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '세부 알람 정보 가져오기 API',
    description: '알람id를 query로 날려서 세부 알람정보를 받습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '알람 가져오기 성공',
    type: GetAlarmOutput,
  })
  @ApiResponse({
    status: 404,
    description: '알람이 없음<br/>루틴을 찾을 수 없음',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 objectId (id는 무조건 24자)',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async getAlarm(
    @User() user,
    @Param('id') alarmId: string,
  ): Promise<GetAlarmOutput> {
    const input: GetAlarmInput = {
      userId: user.id,
      alarmId,
    };

    const response: GetAlarmOutput = await this.alarmService.getAlarm(input);

    return response;
  }

  @Delete('users/me/alarm/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '알람 삭제 API',
    description: '알람id를 query로 날려서 알람을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '알람 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '알람이 없음',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 objectId (id는 무조건 24자)',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async deleteAlarm(@User() user, @Param('id') alarmId: string): Promise<void> {

    const input: DeleteAlarmInput = {
      userId: user.id,
      alarmId,
    };

    await this.alarmService.deleteAlarm(input);
  }

  @Get('users/me/alarms')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '유저의 모든 알람 가져오는 API',
    description: '유저의 모든 알람을 가져옵니다..',
  })
  @ApiResponse({
    status: 200,
    description: '알람 목록 가져오기 성공',
    type: GetAllAlarmsOutput,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: '알람이 없음',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async getAllAlarm(@User() user): Promise<GetAllAlarmsOutput[]> {
    const input: GetAllAlarmsInput = {
      userId: user.id,
    };

    const result: GetAllAlarmsOutput[] = await this.alarmService.getAllAlarms(input);

    return result;
  }
}
