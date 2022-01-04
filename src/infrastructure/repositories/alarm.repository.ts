import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateCartDto } from 'src/domain/repositories/dto/cart/update.dto';
import { Alarm } from 'src/domain/models/alarm.model';
import { AlarmRepository } from 'src/domain/repositories/alarm.repository';
import { CreateDto } from 'src/domain/repositories/dto/alarm/create.dto';
import { UpdateDto } from 'src/domain/repositories/dto/alarm/update.dto';

@Injectable()
export class AlarmRepositoryImpl implements AlarmRepository {
  constructor(
    @InjectModel('Alarm')
    private readonly alarmModel: Model<Alarm>,
  ) { }
  
  public async create(data: CreateDto): Promise<void> {
    const newAlarm = new this.alarmModel(data);

    await newAlarm.save();
  }

  update(userId: string, alarmId: string, data: UpdateDto): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(userId: string, alarmId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findAll(userId: string, next?: string): Promise<Alarm[]> {
    throw new Error('Method not implemented.');
  }
  findOne(userId: string, alarmId: string): Promise<Alarm> {
    throw new Error('Method not implemented.');
  }



  
}
