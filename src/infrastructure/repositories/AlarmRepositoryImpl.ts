import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConflictAlarmException } from '../exceptions/ConflictAlarmException';
import { Day } from 'src/domain/enums/Day';
import { AlarmValidationException } from '../exceptions/AlarmValidationException';
import { AlarmNotFoundException } from '../exceptions/AlarmNotFoundException';
import { AlarmModel } from 'src/domain/models/AlarmModel';
import { AlarmRepository } from 'src/domain/repositories/alarm/AlarmRepository';
import { CreateAlarmDto } from 'src/domain/repositories/alarm/dtos/CreateAlarmDto';
import { UpdateAlarmDto } from 'src/domain/repositories/alarm/dtos/UpdateAlarmDto';

@Injectable()
export class AlarmRepositoryImpl implements AlarmRepository {
  constructor(
    @InjectModel('Alarm')
    private readonly alarmModel: Model<AlarmModel>,
  ) {}

  public async create(data: CreateAlarmDto): Promise<void> {
    const alarms = await this.alarmModel.find({ user_id: data.userId });

    //중복된 요일
    const conflictDay: Day[] = [];

    //중복검사 결과
    let assertResult: boolean;

    //각각의 요일에 대한 시간 중복검사
    data.day.forEach((day) => {
      alarms.find((alarm) => {
        alarm.day.find((e) => {
          if (e == day && alarm.time == data.time) {
            conflictDay.push(e);

            assertResult = true;
          }
        });
      });
    });

    if (assertResult) {
      throw new ConflictAlarmException(`[${conflictDay}] ${data.time} 중복`);
    }
    const newAlarm = new this.alarmModel(data);

    try {
      await newAlarm.save();
    } catch (err) {
      console.log(err);
    }
  }

  public async update(
    userId: string,
    alarmId: string,
    data: UpdateAlarmDto,
  ): Promise<void> {
    const foundAlarm = await this.alarmModel.findById(alarmId);

    if (!foundAlarm) {
      throw new AlarmNotFoundException('알람이 없음');
    }

    const alarms = await this.alarmModel.find({ user_id: userId });

    //현재 수정중인 알람 중복체크에서 제거
    const index = alarms.findIndex((e) => e['_id'] == alarmId);

    alarms.splice(index, 1);

    //중복된 요일
    const conflictDay: Day[] = [];

    //중복검사 결과
    let assertResult: boolean;

    //각각의 요일에 대한 시간 중복검사
    data.day.forEach((day) => {
      alarms.find((alarm) => {
        alarm.day.find((e) => {
          if (e == day && alarm.time == data.time) {
            conflictDay.push(e);

            assertResult = true;
          }
        });
      });
    });

    if (assertResult) {
      throw new ConflictAlarmException(`[${conflictDay}] ${data.time} 중복`);
    }

    foundAlarm.label = data.label;
    foundAlarm.time = data.time;
    foundAlarm.day = data.day;
    foundAlarm.routineId = data.routineId;

    await foundAlarm.save();
  }

  public async delete(alarmId: string): Promise<void> {
    await this.alarmModel.findByIdAndDelete(alarmId);
  }

  public async findAll(userId: string): Promise<AlarmModel[]> {
    const alarms = await this.alarmModel.find({ user_id: userId });

    if (!alarms) {
      return undefined;
    }

    return alarms;
  }

  public async findOne(alarmId: string): Promise<AlarmModel> {
    const alarm = await this.alarmModel.findById(alarmId);

    if (!alarm) {
      return undefined;
    }

    return alarm;
  }
}
