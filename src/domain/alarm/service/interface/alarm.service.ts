import { Injectable } from '@nestjs/common';
import { AddInput } from 'src/domain/alarm/use-cases/add/dtos/add.input';
import { DeleteInput } from 'src/domain/alarm/use-cases/delete/dtos/delete.input';
import { GetInput } from 'src/domain/alarm/use-cases/get/dtos/get.input';
import { GetAllInput } from 'src/domain/alarm/use-cases/get-all/dtos/get_all.input';

import { UpdateInput } from 'src/domain/alarm/use-cases/update/dtos/update.input';
import { GetOutput } from '../../use-cases/get/dtos/get.output';
import { GetAllOutput } from '../../use-cases/get-all/dtos/get_all.output';

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
