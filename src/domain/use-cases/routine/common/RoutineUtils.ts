import { Injectable } from '@nestjs/common';

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
