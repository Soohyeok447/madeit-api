import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
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
  ) { }

  public async create(data: CreateAlarmDto): Promise<AlarmModel> {
    const newAlarm = new this.alarmModel(data);

    const result = await newAlarm.save();

    return result;
  }

  public async update(
    id: string,
    data: UpdateAlarmDto,
  ): Promise<void> {
    await this.alarmModel.findByIdAndUpdate(
      id, 
      {
        ...data
      },
      { runValidators: true },
      )
  }

  public async delete(alarmId: string): Promise<void> {
    await this.alarmModel.findByIdAndDelete(alarmId);
  }

  public async findAllByUserId(userId: string): Promise<AlarmModel[] | []> {
    const alarms = await this.alarmModel.find({ user_id: userId });

    if (!alarms) {
      return [];
    }

    return alarms;
  }

  public async findOne(alarmId: string): Promise<AlarmModel | null> {
    const alarm = await this.alarmModel.findById(alarmId);

    if (!alarm) {
      return null;
    }

    return alarm;
  }
}
