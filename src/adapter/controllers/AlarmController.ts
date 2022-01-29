import { User } from '../common/decorators/user.decorator';
import { Body, Injectable, Param } from '@nestjs/common';
import { AddAlarmRequestDto } from '../dto/alarm/AddAlarmRequestDto';
import { UpdateAlarmRequestDto } from '../dto/alarm/UpdateAlarmRequestDto';
import { AlarmCommonService } from '../../domain/use-cases/alarm/service/AlarmCommonService';
import { AddAlarmUsecaseParams } from '../../domain/use-cases/alarm/add-alarm/dtos/AddAlarmUsecaseParams';
import { UpdateAlarmUsecaseParams } from '../../domain/use-cases/alarm/update-alarm/dtos/UpdateAlarmUsecaseParams';
import { GetAlarmResponseDto } from '../../domain/use-cases/alarm/get-alarm/dtos/GetAlarmResponseDto';
import { GetAlarmUsecaseParams } from '../../domain/use-cases/alarm/get-alarm/dtos/GetAlarmUsecaseParams';
import { DeleteAlarmUsecaseParams } from '../../domain/use-cases/alarm/delete-alarm/dtos/DeleteAlarmUsecaseParams';
import { GetAllAlarmsResponseDto } from '../../domain/use-cases/alarm/get-all-alarms/dtos/GetAllAlarmsResponseDto';
import { GetAllAlarmsUsecaseParams } from '../../domain/use-cases/alarm/get-all-alarms/dtos/GetAllAlarmsUsecaseParams';
import {
  AddAlarmResponse,
  DeleteAlarmResponse,
  GetAlarmResponse,
  GetAllAlarmsResponse,
  UpdateAlarmResponse,
} from '../../domain/use-cases/alarm/response.index';
import { AddAlarmUseCase } from '../../domain/use-cases/alarm/add-alarm/AddAlarmUseCase';
import { UpdateAlarmUseCase } from '../../domain/use-cases/alarm/update-alarm/UpdateAlarmUseCase';
import { DeleteAlarmUseCase } from '../../domain/use-cases/alarm/delete-alarm/DeleteAlarmUseCase';
import { GetAlarmUseCase } from '../../domain/use-cases/alarm/get-alarm/GetAlarmUseCase';
import { GetAllAlarmsUseCase } from '../../domain/use-cases/alarm/get-all-alarms/GetAllAlarmsUseCase';

@Injectable()
export class AlarmController {
  constructor(
    private readonly alarmService: AlarmCommonService,
    private readonly _addAlarmUseCase: AddAlarmUseCase,
    private readonly _updateAlarmUseCase: UpdateAlarmUseCase,
    private readonly _deleteAlarmUseCase: DeleteAlarmUseCase,
    private readonly _getAlarmUseCase: GetAlarmUseCase,
    private readonly _getAllAlarmsUseCase: GetAllAlarmsUseCase,
  ) {}

  async addAlarm(
    @User() user,
    @Body() addAlarmRequest: AddAlarmRequestDto,
  ): AddAlarmResponse {
    const input: AddAlarmUsecaseParams = {
      userId: user.id,
      ...addAlarmRequest,
    };

    await this._addAlarmUseCase.execute(input);
  }

  async updateAlarm(
    @User() user,
    @Param('id') alarmId: string,
    @Body() updateAlarmRequest: UpdateAlarmRequestDto,
  ): UpdateAlarmResponse {
    const input: UpdateAlarmUsecaseParams = {
      userId: user.id,
      alarmId,
      ...updateAlarmRequest,
    };

    await this._updateAlarmUseCase.execute(input);
  }

  async deleteAlarm(
    @User() user,
    @Param('id') alarmId: string,
  ): DeleteAlarmResponse {
    const input: DeleteAlarmUsecaseParams = {
      userId: user.id,
      alarmId,
    };

    await this._deleteAlarmUseCase.execute(input);
  }

  async getAlarm(@User() user, @Param('id') alarmId: string): GetAlarmResponse {
    const input: GetAlarmUsecaseParams = {
      userId: user.id,
      alarmId,
    };

    const response: GetAlarmResponseDto = await this._getAlarmUseCase.execute(
      input,
    );

    return response;
  }

  async getAllAlarms(@User() user): GetAllAlarmsResponse {
    const input: GetAllAlarmsUsecaseParams = {
      userId: user.id,
    };

    const result: GetAllAlarmsResponseDto[] | [] =
      await this._getAllAlarmsUseCase.execute(input);

    return result;
  }
}
