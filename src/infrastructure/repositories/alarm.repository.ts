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

@Injectable()
export class AlarmRepositoryImpl implements AlarmRepository {
  constructor(
    @InjectModel('Alarm')
    private readonly alarmModel: Model<Alarm>,
  ) { }

  public async create(data: CreateDto): Promise<void> {
    const alarms = await this.alarmModel.find({ user_id : data.userId});

    //중복된 요일
    let conflictDay = [];

    //중복검사 결과
    let assertResult;

    //각각의 요일에 대한 시간 중복검사
    data.day.forEach(day => {
      alarms.find(alarm => {
        alarm.day.find(e => {
          if(e == day && alarm.time == data.time){
            conflictDay.push(e);

            assertResult=true;
          }
        })

      })
    })

    if (assertResult) {
      throw new ConflictAlarmException(`[${conflictDay}] ${data.time} 중복`);
    }

    const newAlarm = new this.alarmModel(data);

    try{
      await newAlarm.save();
      
    }catch(err){

      for(let error in err.errors) {
        
        if(err["_message"] == 'Alarm validation failed'){
          throw new AlarmValidationException(`유효하지 않은 값 ${err.errors[error].value}`);
        }
      }
    }
  }

  update(userId: string, alarmId: string, data: UpdateDto): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(userId: string, alarmId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findAll(userId: string): Promise<Alarm[]> {
    throw new Error('Method not implemented.');
  }

  findOne(userId: string, alarmId: string): Promise<Alarm> {
    throw new Error('Method not implemented.');
  }



  
}
