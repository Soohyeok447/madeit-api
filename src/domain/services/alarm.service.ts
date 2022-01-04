import { Injectable } from "@nestjs/common";
import { AddInput } from "../dto/alarm/add.input";
import { ChangeTitleInput } from "../dto/alarm/change_title.input";
import { DeleteInput } from "../dto/alarm/delete.input";
import { GetAllInput } from "../dto/alarm/get_all.input";
import { GetAllOutput } from "../dto/alarm/get_all.output";
import { UpdateInput } from "../dto/alarm/update.input";
import { AlarmConflictException } from "../exceptions/alarm/alarm_conflict.exception";
import { AlarmNotFoundException } from "../../infrastructure/exceptions/alarm_not_found.exception";
import { InvalidTimeException } from "../exceptions/alarm/invalid_time.exception";
import { UserNotFoundException } from "../exceptions/users/user_not_found.exception";
import { AlarmRepository } from "../repositories/alarm.repository";
import { UserRepository } from "../repositories/users.repository";
import { AlarmService } from "./interfaces/alarm.service";
import { RoutineRepository } from "../repositories/routine.repsotiroy";
import { RoutineNotFoundException } from "../exceptions/routine/routine_not_found.exception";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { InvalidObjectIdException } from "../exceptions/common/invalid_object_id.exception";
import { GetInput } from "../dto/alarm/get.input";
import { GetOutput } from "../dto/alarm/get.output";
import { Alarm } from "../models/alarm.model";
import { Routine } from "../models/routine.model";
import { resolve } from "path/posix";

@Injectable()
export class AlarmServiceImpl implements AlarmService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly alarmRepository: AlarmRepository,
    private readonly routineRepository: RoutineRepository,
  ) { }
  
  public async get({ userId, alarmId, }: GetInput): Promise<GetOutput> {
    
    if(
      userId.length!==24 || 
      alarmId.length!==24
    ){
      throw new InvalidObjectIdException('유효하지 않은 ObjectId');
    }

    await this.assertUser(userId);

    const alarm: Alarm = await this.assertAlarm(alarmId);

    const routine: Routine = await this.assertRoutine(alarm.routineId);

    const output: GetOutput = {
      alarmId: alarm["id"],
      label: alarm["label"],
      time: alarm['time'],
      day: [...alarm['day']],
      routineId: alarm["routineId"],
      routineName: routine["name"],
    }

    return output;
  }

  public async getAll({ userId }: GetAllInput): Promise<GetAllOutput[]> {
    await this.assertUser(userId);

    const alarms: Alarm[] = await this.alarmRepository.findAll(userId);

    if(!alarms){
      throw new AlarmNotFoundException('알람이 없음');
    }

    let output: GetAllOutput[] = []; 

    for(let alarm of alarms){
      const routine = await this.routineRepository.findOne(alarm.routineId);
      
      const mapping = {
        alarmId: alarm["_id"],
        routineId: alarm["routine_id"],
        time: alarm["time"],
        label: alarm["label"],
        day: alarm["day"],
        routineName: routine["name"],
      }

      output.push(mapping);
    }
    
    return output;
  }

  public async add({ userId, alias, time, day, routineId }: AddInput): Promise<void> {
    const alarm = {
      userId,
      alias,
      time,
      day,
      routineId
    }

    if(userId.length!==24 || routineId.length!==24){
      throw new InvalidObjectIdException(`잘못된 objectId`);
    }

    await this.assertUser(userId);

    await this.assertRoutine(routineId);

    this.assertTime(time);

    await this.alarmRepository.create(alarm);
  }

  public async update({ userId, alarmId, alias, time, day, routineId }: UpdateInput): Promise<void> {
    const input = {
      alias,
      time,
      day,
      routineId
    }

    if(
      userId.length!==24 || 
      alarmId.length!==24 ||
      routineId.length!==24
    ){
      throw new InvalidObjectIdException(`잘못된 objectId`);
    }

    await this.assertUser(userId);

    await this.assertRoutine(routineId);

    this.assertTime(time);

    await this.alarmRepository.update(userId, alarmId, input);
  }

  private async assertRoutine(routineId: string) {
    const routine = await this.routineRepository.findOne(routineId);

    if (!routine) {
      throw new RoutineNotFoundException();
    }

    return routine;
  }

  public async delete({ userId, alarmId, }: DeleteInput): Promise<void> {
    if(
      userId.length!==24 || 
      alarmId.length!==24 
    ){
      throw new InvalidObjectIdException(`잘못된 objectId`);
    }

    await this.assertUser(userId);

    await this.assertAlarm(alarmId);

    await this.alarmRepository.delete(alarmId);
  }

  private async assertUser(userId: string) {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }
  }

  private assertTime(time: number) {
    const stringTime: string = time.toString();

    if (+stringTime[2] > 5 || //60분 초과
      time < 1 || //0000 이하
      time > 2400 || // 2400 초과
      time.toString().length !== 4 // time이 4자리가 아니면
    ) {
      throw new InvalidTimeException(`유효하지않은 time ${time}`);
    }
  }

  private async assertAlarm(alarmId: string) {
    const alarm = await this.alarmRepository.findOne(alarmId);

    if (!alarm) {
      throw new AlarmNotFoundException('알람이 없음');
    }
    return alarm;
  }

 

}