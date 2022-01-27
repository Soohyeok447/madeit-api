import { Injectable } from '@nestjs/common';
import { AddAlarmUsecaseDto } from '../../use-cases/add-alarm/dtos/AddAlarmUsecaseDto';
import { DeleteAlarmUsecaseDto } from '../../use-cases/delete-alarm/dtos/DeleteAlarmUsecaseDto';
import { GetAlarmResponseDto } from '../../use-cases/get-alarm/dtos/GetAlarmResponseDto';
import { GetAlarmUsecaseDto } from '../../use-cases/get-alarm/dtos/GetAlarmUsecaseDto';
import { GetAllAlarmsResponseDto } from '../../use-cases/get-all-alarms/dtos/GetAllAlarmsResponseDto';
import { GetAllAlarmsUsecaseDto } from '../../use-cases/get-all-alarms/dtos/GetAllAlarmsUsecaseDto';
import { UpdateAlarmUsecaseDto } from '../../use-cases/update-alarm/dtos/UpdateAlarmUsecaseDto';

@Injectable()
export abstract class AlarmService {
  /**
   * 유저의 알람을 가져옴
   */
  public abstract getAlarm({
    userId,
    alarmId,
  }: GetAlarmUsecaseDto): Promise<GetAlarmResponseDto>;

  /**
   * 유저의 알람 리스트를 가져옴
   */
  public abstract getAllAlarms({
    userId,
  }: GetAllAlarmsUsecaseDto): Promise<GetAllAlarmsResponseDto[]>;

  /**
   * 알람 추가
   */
  public abstract addAlarm({
    userId,
    label,
    time,
    day,
    routineId,
  }: AddAlarmUsecaseDto): Promise<void>;

  /**
   * 알람 수정
   */
  public abstract updateAlarm({
    userId,
    alarmId,
    label,
    time,
    day,
    routineId,
  }: UpdateAlarmUsecaseDto): Promise<void>;

  /**
   * 알람 제거
   */
  public abstract deleteAlarm({
    userId,
    alarmId,
  }: DeleteAlarmUsecaseDto): Promise<void>;
}
