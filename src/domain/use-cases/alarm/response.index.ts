import { GetAlarmResponseDto } from "./use-cases/get-alarm/dtos/GetAlarmResponseDto";
import { GetAllAlarmsResponseDto } from "./use-cases/get-all-alarms/dtos/GetAllAlarmsResponseDto";

export type AddAlarmResponse = Promise<void>;

export type UpdateAlarmResponse = Promise<void>;

export type DeleteAlarmResponse = Promise<void>;

export type GetAlarmResponse = Promise<GetAlarmResponseDto>;

export type GetAllAlarmsResponse = Promise<GetAllAlarmsResponseDto[] | []>;