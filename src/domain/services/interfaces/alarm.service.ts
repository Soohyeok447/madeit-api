import { Injectable } from '@nestjs/common';
import { AddInput } from 'src/domain/dto/alarm/add.input';
import { ChangeTitleInput } from 'src/domain/dto/alarm/change_title.input';
import { DeleteInput } from 'src/domain/dto/alarm/delete.input';
import { GetListInput } from 'src/domain/dto/alarm/get_list.input';
import { GetListOutput } from 'src/domain/dto/alarm/get_list.output';
import { UpdateInput } from 'src/domain/dto/alarm/update.input';

@Injectable()
export abstract class AlarmService {
  /**
   * 유저의 알람 리스트를 가져옴
   */
  public abstract getList({
    userId,
  }: GetListInput): Promise<GetListOutput>;

  /**
   * 알람 추가
   */
  public abstract add({
    userId,
    alias,
    time,
    day,
    routineId
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
  }: UpdateInput): Promise<void>;

  /**
   * 알람 제거
   */
  public abstract delete({
    userId,
    alarmId,
  }: DeleteInput): Promise<void>;


  /**
   * 알람리스트 이름 변경
   */
  public abstract changeTitle({
    userId,
    newTitle,
  }: ChangeTitleInput): Promise<void>;
}
