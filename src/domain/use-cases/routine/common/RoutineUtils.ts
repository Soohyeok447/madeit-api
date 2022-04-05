import { Injectable } from '@nestjs/common';
import { Routine } from '../../../entities/Routine';
import { CreateRoutineDto } from '../../../repositories/routine/dtos/CreateRoutineDto';
import { UpdateRoutineDto } from '../../../repositories/routine/dtos/UpdateRoutineDto';
import { ConflictRoutineAlarmException } from './exceptions/ConflictAlarmException';

@Injectable()
export class RoutineUtils {
  public static validateHour(hour: number): boolean {
    if (hour < 0 || hour > 23) return false;

    return true;
  }

  public static validateMinute(minute: number): boolean {
    if (minute < 0 || minute > 59) return false;

    return true;
  }

  public static assertAlarmDuplication(
    newRoutine: CreateRoutineDto | UpdateRoutineDto,
    existRoutines: Routine[],
    modifyTargetRoutineId?: string,
  ): void {
    if (!existRoutines.length) return;

    // const deepRoutines: Routine[] = JSON.parse(JSON.stringify(existRoutines));

    //현재 수정중인 알람 중복체크에서 제거
    spliceSelfIfModifying();

    //중복 검사 결과
    let assertResult: boolean;

    //중복된 요일
    const conflictDay: number[] = [];

    assertRoutineDuplication();

    if (assertResult) {
      throw new ConflictRoutineAlarmException(
        conflictDay,
        newRoutine.hour,
        newRoutine.minute,
      );
    }

    function assertRoutineDuplication(): void {
      newRoutine.days.forEach((day) => {
        existRoutines.forEach((routine) => {
          routine.days.forEach((e) => {
            if (
              e === day &&
              routine.hour === newRoutine.hour &&
              routine.minute === newRoutine.minute
            ) {
              conflictDay.push(e);

              assertResult = true;
            }
          });
        });
      });
    }

    function spliceSelfIfModifying(): void {
      if (modifyTargetRoutineId) {
        const index: number = existRoutines.findIndex((e) => {
          return e.id == modifyTargetRoutineId;
        });

        existRoutines.splice(index, 1);
      }
    }
  }

  public static convertDaysToString(days: number[]): string[] | string {
    const date: any = {
      1: '월',
      2: '화',
      3: '수',
      4: '목',
      5: '금',
      6: '토',
      7: '일',
    };

    const deepDays: number[] = JSON.parse(JSON.stringify(days));

    const sortedDays: number[] = deepDays.sort();

    if (sortedDays.length === 7) {
      return '매일';
    }

    if (sortedDays[0] === 6 && sortedDays[1] === 7 && sortedDays.length === 2) {
      return '주말';
    }

    if (
      sortedDays[0] === 1 &&
      sortedDays[1] === 2 &&
      sortedDays[2] === 3 &&
      sortedDays[3] === 4 &&
      sortedDays[4] === 5 &&
      sortedDays.length === 5
    ) {
      return '평일';
    }

    const result: string[] = sortedDays.map((e) => date[e]);

    return result;
  }
}
