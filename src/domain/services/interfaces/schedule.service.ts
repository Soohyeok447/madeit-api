import { Injectable } from '@nestjs/common';
import { ChangeScheduleTitleInput } from 'src/domain/dto/schedule/change_schedule_title.input';
import { DecideScheduleInput } from 'src/domain/dto/schedule/decide_schedule.input';
import { GetScheduleInput } from 'src/domain/dto/schedule/get_schedule.input';
import { GetScheduleOutput } from 'src/domain/dto/schedule/get_schedule.output';

@Injectable()
export abstract class ScheduleService {
  /**
   * 유저의 스케줄을 가져옴
   */
  public abstract getSchedule({
    userId,
  }: GetScheduleInput): Promise<GetScheduleOutput>;

  /**
   * 스케줄 확정
   */
  public abstract decideSchedule({
    userId,
    schedule,
  }: DecideScheduleInput): Promise<void>;

  /**
   * 스케줄 이름 변경
   */
  public abstract changeScheduleTitle({
    userId,
    newTitle,
  }: ChangeScheduleTitleInput): Promise<void>;
}
