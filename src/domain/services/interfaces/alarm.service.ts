import { Injectable } from '@nestjs/common';
import { AddInput } from 'src/domain/dto/alarm/add.input';
import { ChangeTitleInput } from 'src/domain/dto/alarm/change_title.input';
import { DeleteInput } from 'src/domain/dto/alarm/delete.input';
import { GetInput } from 'src/domain/dto/alarm/get.input';
import { GetOutput } from 'src/domain/dto/alarm/get.output';
import { GetAllInput } from 'src/domain/dto/alarm/get_all.input';
import { GetAllOutput } from 'src/domain/dto/alarm/get_all.output';
import { UpdateInput } from 'src/domain/dto/alarm/update.input';

@Injectable()
export abstract class AlarmService {
  /**
   * 유저의 알람을 가져옴
   */
  public abstract get({ userId, alarmId }: GetInput): Promise<GetOutput>;

  /**
   * 유저의 알람 리스트를 가져옴
   */
  public abstract getAll({ userId }: GetAllInput): Promise<GetAllOutput[]>;

  /**
   * 알람 추가
   */
  public abstract add({
    userId,
    alias,
    time,
    day,
    routineId,
  }: AddInput): Promise<void>;

  /**
   * 알람 수정
   */
  public abstract update({
    userId,
    alarmId,
    alias,
    time,
    day,
    routineId,
  }: UpdateInput): Promise<void>;

  /**
   * 알람 제거
   */
  public abstract delete({ userId, alarmId }: DeleteInput): Promise<void>;
}