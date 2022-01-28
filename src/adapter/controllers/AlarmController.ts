import { User } from '../common/decorators/user.decorator';
import {
  Body,
  Injectable,
  Param,
} from '@nestjs/common';
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
import { AddAlarmResponse, DeleteAlarmResponse, GetAlarmResponse, GetAllAlarmsResponse, UpdateAlarmResponse } from '../../domain/use-cases/alarm/response.index';

@Injectable()
export class AlarmController {
  constructor(
    private readonly alarmService: AlarmService,

  ) { }

  async addAlarm(
    @User() user,
    @Body() addAlarmRequest: AddAlarmRequestDto,
  ): AddAlarmResponse {
    const input: AddAlarmUsecaseDto = {
      userId: user.id,
      ...addAlarmRequest,
    };

    await this.alarmService.addAlarm(input);
  }

  async updateAlarm(
    @User() user,
    @Param('id') alarmId: string,
    @Body() updateAlarmRequest: UpdateAlarmRequestDto,
  ): UpdateAlarmResponse {
    const input: UpdateAlarmUsecaseDto = {
      userId: user.id,
      alarmId,
      ...updateAlarmRequest,
    };

    await this.alarmService.updateAlarm(input);
  }

  async deleteAlarm(
    @User() user,
    @Param('id') alarmId: string
  ): DeleteAlarmResponse {
    const input: DeleteAlarmUsecaseDto = {
      userId: user.id,
      alarmId,
    };

    await this.alarmService.deleteAlarm(input);
  }

  async getAlarm(
    @User() user,
    @Param('id') alarmId: string,
  ): GetAlarmResponse {
    const input: GetAlarmUsecaseDto = {
      userId: user.id,
      alarmId,
    };

    const response: GetAlarmResponseDto = await this.alarmService.getAlarm(
      input,
    );

    return response;
  }

  async getAllAlarms(
    @User() user
  ): GetAllAlarmsResponse {
    const input: GetAllAlarmsUsecaseDto = {
      userId: user.id,
    };

    const result: GetAllAlarmsResponseDto[] =
      await this.alarmService.getAllAlarms(input);

    return result;
  }
}
