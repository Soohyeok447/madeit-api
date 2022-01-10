import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Alarm } from 'src/domain/common/models/alarm.model';
import { AlarmRepository } from 'src/domain/common/repositories/alarm/alarm.repository';
import { CreateAlarmDto } from 'src/domain/common/repositories/alarm/dtos/create.dto';
import { ConflictAlarmException } from '../exceptions/conflict_alarm.exception';
import { Day } from 'src/domain/common/enums/day.enum';
import { AlarmValidationException } from '../exceptions/alarm_validation.exception';
import { AlarmNotFoundException } from '../exceptions/alarm_not_found.exception';
import { UpdateAlarmDto } from 'src/domain/common/repositories/alarm/dtos/update.dto';

@Injectable()
export class AlarmRepositoryImpl implements AlarmRepository {
  constructor(
    @InjectModel('Alarm')
    private readonly alarmModel: Model<Alarm>,
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

  public async findAll(userId: string): Promise<Alarm[]> {
    const alarms = await this.alarmModel.find({ user_id: userId });

    if (!alarms) {
      return undefined;
    }

    return alarms;
  }

  public async findOne(alarmId: string): Promise<Alarm> {
    const alarm = await this.alarmModel.findById(alarmId);

    if (!alarm) {
      return undefined;
    }

    return alarm;
  }
}
