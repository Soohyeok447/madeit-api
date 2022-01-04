import { Injectable } from "@nestjs/common";
import { AddInput } from "../dto/alarm/add.input";
import { ChangeTitleInput } from "../dto/alarm/change_title.input";
import { DeleteInput } from "../dto/alarm/delete.input";
import { GetListInput } from "../dto/alarm/get_list.input";
import { GetListOutput } from "../dto/alarm/get_list.output";
import { UpdateInput } from "../dto/alarm/update.input";
import { AlarmConflictException } from "../exceptions/alarm/alarm_conflict.exception";
import { InvalidTimeException } from "../exceptions/alarm/invalid_time.exception";
import { UserNotFoundException } from "../exceptions/users/user_not_found.exception";
import { AlarmRepository } from "../repositories/alarm.repository";
import { UserRepository } from "../repositories/users.repository";
import { AlarmService } from "./interfaces/alarm.service";

@Injectable()
export class AlarmServiceImpl implements AlarmService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly alarmRepository: AlarmRepository,
  ) { }

  public async getList({ userId }: GetListInput): Promise<GetListOutput> {
    throw new Error("Method not implemented.");
  }

  public async add({ userId, alias, time, day, routineId }: AddInput): Promise<void> {
    const alarm = {
      userId,
      alias,
      time,
      day,
      routineId
    }

    const user = await this.userRepository.findOne(userId);

    if(!user){
      throw new UserNotFoundException();
    }

    if( time < 1 || time > 2400){
      throw new InvalidTimeException(`유효하지않은 time ${time}`);
    }


    await this.alarmRepository.create(alarm);
  }

  public async update({ userId, alarmId, alias, time, day, }: UpdateInput): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async delete({ userId, alarmId, }: DeleteInput): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async changeTitle({ userId, newTitle, }: ChangeTitleInput): Promise<void> {
    throw new Error("Method not implemented.");
  }

}