import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateCartDto } from 'src/domain/repositories/dto/cart/update.dto';
import { Alarm } from 'src/domain/models/alarm.model';
import { AlarmRepository } from 'src/domain/repositories/alarm.repository';
import { CreateDto } from 'src/domain/repositories/dto/alarm/create.dto';
import { UpdateDto } from 'src/domain/repositories/dto/alarm/update.dto';
import { ConflictAlarmException } from '../exceptions/conflict_alarm.exception';
import { Day } from 'src/domain/models/enum/day.enum';
import { AlarmValidationException } from '../exceptions/alarm_validation.exception';
import { AlarmNotFoundException } from '../exceptions/alarm_not_found.exception';

@Injectable()
export class AlarmRepositoryImpl implements AlarmRepository {
  constructor(
    @InjectModel('Alarm')
    private readonly alarmModel: Model<Alarm>,
  ) { }

  public async create(data: CreateDto): Promise<void> {
    const alarms = await this.alarmModel.find({ user_id: data.userId });

    //중복된 요일
    let conflictDay: Day[] = [];

    //중복검사 결과
    let assertResult: boolean;

    //각각의 요일에 대한 시간 중복검사
    data.day.forEach(day => {
      alarms.find(alarm => {
        alarm.day.find(e => {
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

  public async update(userId:string, alarmId: string, data: UpdateDto): Promise<void> {
    const foundAlarm = await this.alarmModel.findById(alarmId);

    if(!foundAlarm){
      throw new AlarmNotFoundException('알람이 없음');
    }

    let alarms = await this.alarmModel.find({ user_id: userId });

    //현재 수정중인 알람 중복체크에서 제거
    const index = alarms.findIndex(e=> e["_id"] == alarmId);

    alarms.splice(index,1);

    //중복된 요일
    let conflictDay: Day[] = [];

    //중복검사 결과
    let assertResult: boolean;

    //각각의 요일에 대한 시간 중복검사
    data.day.forEach(day => {
      alarms.find(alarm => {
        alarm.day.find(e => {
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
    
    foundAlarm.alias = data.alias;
    foundAlarm.time = data.time;
    foundAlarm.day = data.day;
    foundAlarm.routineId = data.routineId;

    await foundAlarm.save();
  }

  delete(userId: string, alarmId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async findAll(userId: string): Promise<Alarm[]> {
    const alarms = await this.alarmModel.find({user_id: userId});

    if(!alarms){
      return undefined;
    }

    return alarms;
  }

  public async findOne(alarmId: string): Promise<Alarm> {
    const alarm = await this.alarmModel.findById(alarmId);

    if(!alarm){
      return undefined;
    }

    return alarm;
  }

}
