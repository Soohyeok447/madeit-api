import { Injectable } from '@nestjs/common';
import { RoutineNotFoundException } from '../../../common/exceptions/customs/RoutineNotFoundException';
import { RoutineModel } from '../../../models/RoutineModel';
import { CreateRoutineDto } from '../../../repositories/routine/dtos/CreateRoutineDto';
import { UpdateRoutineDto } from '../../../repositories/routine/dtos/UpdateRoutineDto';
import { ConflictRoutineAlarmException } from '../common/exceptions/ConflictAlarmException';
import { InvalidTimeException } from '../common/exceptions/InvalidTimeException';

@Injectable()
export class CommonRoutineService {
  static assertRoutineExistence(routine: RoutineModel) {
    if (!routine) {
      throw new RoutineNotFoundException();
    }
  }

  static assertTimeValidation(hour: number, minute: number) {
    if (hour < 0 || hour > 23) {
      throw new InvalidTimeException(hour);
    }

    if (minute < 0 || minute > 59) {
      throw new InvalidTimeException(minute);
    }
  }

  static assertAlarmDuplication(
    newRoutine: CreateRoutineDto | UpdateRoutineDto,
    existRoutines: RoutineModel[],
    modifyTargetRoutineId?: string,
  ) {
    if (!existRoutines.length) return;

    const deepRoutines: RoutineModel[] = JSON.parse(
      JSON.stringify(existRoutines),
    );

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

    function assertRoutineDuplication() {
      newRoutine.days.forEach((day) => {
        deepRoutines.forEach((routine) => {
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

    function spliceSelfIfModifying() {
      if (modifyTargetRoutineId) {
        const index = deepRoutines.findIndex(
          (e) => e['_id'] === modifyTargetRoutineId,
        );

        deepRoutines.splice(index, 1);
      }
    }
  }

  static convertDaysToString(days: number[]): string[] | string {
    const date = {
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

  static sortDays(days: number[]) {
    return days.sort();
  }
}
