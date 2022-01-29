import { GetAlarmResponseDto } from './get-alarm/dtos/GetAlarmResponseDto';
import { GetAllAlarmsResponseDto } from './get-all-alarms/dtos/GetAllAlarmsResponseDto';

export type AddAlarmResponse = Promise<void>;

export type UpdateAlarmResponse = Promise<void>;

export type DeleteAlarmResponse = Promise<void>;

export type GetAlarmResponse = Promise<GetAlarmResponseDto>;

export type GetAllAlarmsResponse = Promise<GetAllAlarmsResponseDto[] | []>;
