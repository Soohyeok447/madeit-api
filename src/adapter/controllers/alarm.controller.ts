import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { string } from 'joi';
import { AddInput } from 'src/domain/dto/alarm/add.input';
import { DeleteInput } from 'src/domain/dto/alarm/delete.input';
import { GetInput } from 'src/domain/dto/alarm/get.input';
import { GetOutput } from 'src/domain/dto/alarm/get.output';
import { GetAllInput } from 'src/domain/dto/alarm/get_all.input';
import { GetAllOutput } from 'src/domain/dto/alarm/get_all.output';
import { UpdateInput } from 'src/domain/dto/alarm/update.input';
import { AlarmService } from 'src/domain/services/interfaces/alarm.service';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../common/swagger.dto';
import { AddAlarmRequest } from '../dto/alarm/add_alarm.request';
import { UpdateAlarmRequest } from '../dto/alarm/update_alarm.request';

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
    description: '시간이 중복되는 알람 추가 시도 시 <br/>ex)[friday,monday] 1230 중복',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 시간으로 요청을 보냈을 시 <br/> ex)유효하지않은 time 123<br/><br/> 잘못된 objectId (id는 무조건 24자)',
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


  @Post('update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '알람 수정 API',
    description:
      '알람을 수정합니다.',
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
    description: '시간이 중복되는 알람 추가 시도 시 <br/>ex)[friday,monday] 1230 중복',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 404,
    description: '수정할 알람이 없음',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 시간으로 요청을 보냈을 시 <br/> ex)유효하지않은 time 123 <br/><br/> 잘못된 objectId (id는 무조건 24자)',
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
    @Body() updateAlarmRequest: UpdateAlarmRequest,
  ): Promise<void> {
    const input: UpdateInput = {
      userId: user.id,
      ...updateAlarmRequest
    };

    await this.alarmService.update(input);
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '세부 알람 정보 가져오기 API',
    description:
      '알람id를 query로 날려서 세부 알람정보를 받습니다.',
  })
  @ApiQuery({
    description:'세부 알람을 가져오기 위한 alarm id',
    name: 'id',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '알람 가져오기 성공',
    type: GetOutput,
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
    @Query() query: string,
  ): Promise<GetOutput> {
    const input: GetInput = {
      userId: user.id,
      alarmId: query['id']
    };

    const response: GetOutput = await this.alarmService.get(input);

    return response;
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '알람 삭제 API',
    description:
      '알람id를 query로 날려서 알람을 삭제합니다.',
  })
  @ApiQuery({
    description:'알람을 삭제하기 위한 alarm id',
    name: 'id',
    type: String,
    required: true,
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
  async deleteAlarm(
    @User() user,
    @Query() query: string,
  ): Promise<void> {
    const input: DeleteInput = {
      userId: user.id,
      alarmId: query['id']
    };

    await this.alarmService.delete(input);
  }


  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '유저의 모든 알람 가져오는 API',
    description:
      '유저의 모든 알람을 가져옵니다..',
  })
  @ApiResponse({
    status: 200,
    description: '알람 목록 가져오기 성공',
    type:GetAllOutput,
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
  async getAllAlarm(
    @User() user,
  ): Promise<GetAllOutput[]> {
    const input: GetAllInput = {
      userId: user.id,
    };

    const result: GetAllOutput[] = await this.alarmService.getAll(input);

    return result;
  }
}
