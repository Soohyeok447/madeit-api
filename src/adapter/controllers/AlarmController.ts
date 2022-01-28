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
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/JwtAuthGuard.guard';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../../ioc/controllers/SwaggerExceptions';
import { AddAlarmRequestDto } from '../dto/alarm/AddAlarmRequestDto';
import { UpdateAlarmRequestDto } from '../dto/alarm/UpdateAlarmRequestDto';
import { AlarmService } from '../../domain/use-cases/alarm/service/interface/AlarmService';
import { AddAlarmUsecaseDto } from '../../domain/use-cases/alarm/use-cases/add-alarm/dtos/AddAlarmUsecaseDto';
import { UpdateAlarmUsecaseDto } from '../../domain/use-cases/alarm/use-cases/update-alarm/dtos/UpdateAlarmUsecaseDto';
import { GetAlarmResponseDto } from '../../domain/use-cases/alarm/use-cases/get-alarm/dtos/GetAlarmResponseDto';
import { GetAlarmUsecaseDto } from '../../domain/use-cases/alarm/use-cases/get-alarm/dtos/GetAlarmUsecaseDto';
import { DeleteAlarmUsecaseDto } from '../../domain/use-cases/alarm/use-cases/delete-alarm/dtos/DeleteAlarmUsecaseDto';
import { GetAllAlarmsResponseDto } from '../../domain/use-cases/alarm/use-cases/get-all-alarms/dtos/GetAllAlarmsResponseDto';
import { GetAllAlarmsUsecaseDto } from '../../domain/use-cases/alarm/use-cases/get-all-alarms/dtos/GetAllAlarmsUsecaseDto';

@Controller('v1')
@ApiTags('알람 관련 API')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Post('alarms')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '알람 추가 API',
    description: '알람을 추가합니다.',
  })
  @ApiBody({
    description: '알람을 추가하기 위한 alarm request dto',
    type: AddAlarmRequestDto,
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
    @Body() addAlarmRequest: AddAlarmRequestDto,
  ): Promise<void> {
    const input: AddAlarmUsecaseDto = {
      userId: user.id,
      ...addAlarmRequest,
    };

    await this.alarmService.addAlarm(input);
  }

  @Put('alarms/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '알람 수정 API',
    description: '알람을 수정합니다.',
  })
  @ApiBody({
    description: '알람을 수정하기 위한 alarm request dto',
    type: UpdateAlarmRequestDto,
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
    @Body() updateAlarmRequest: UpdateAlarmRequestDto,
  ): Promise<void> {
    const input: UpdateAlarmUsecaseDto = {
      userId: user.id,
      alarmId,
      ...updateAlarmRequest,
    };

    await this.alarmService.updateAlarm(input);
  }

  @Get('alarms/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '세부 알람 정보 가져오기 API',
    description: '알람id를 query로 날려서 세부 알람정보를 받습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '알람 가져오기 성공',
    type: GetAlarmResponseDto,
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
  ): Promise<GetAlarmResponseDto> {
    const input: GetAlarmUsecaseDto = {
      userId: user.id,
      alarmId,
    };

    const response: GetAlarmResponseDto = await this.alarmService.getAlarm(
      input,
    );

    return response;
  }

  @Delete('alarms/:id')
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
    const input: DeleteAlarmUsecaseDto = {
      userId: user.id,
      alarmId,
    };

    await this.alarmService.deleteAlarm(input);
  }

  @Get('alarms')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '유저의 모든 알람 가져오는 API',
    description: '유저의 모든 알람을 가져옵니다..',
  })
  @ApiResponse({
    status: 200,
    description: '알람 목록 가져오기 성공',
    type: GetAllAlarmsResponseDto,
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
  async getAllAlarm(@User() user): Promise<GetAllAlarmsResponseDto[]> {
    const input: GetAllAlarmsUsecaseDto = {
      userId: user.id,
    };

    const result: GetAllAlarmsResponseDto[] =
      await this.alarmService.getAllAlarms(input);

    return result;
  }
}
