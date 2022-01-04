import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddInput } from 'src/domain/dto/alarm/add.input';
import { AlarmService } from 'src/domain/services/interfaces/alarm.service';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../common/swagger.dto';
import { AddAlarmRequest } from '../dto/alarm/add_alarm.request';

@Controller('v1/alarm')
@ApiTags('알람 관련 API')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) { }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '알람 추가 API',
    description:
      '알람을 추가합니다.',
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
    description: '시간이 중복되는 알람 추가 시도 시',
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
    const input: AddInput = {
      userId: user.id,
      ...addAlarmRequest
    };

    await this.alarmService.add(input);
  }
}
