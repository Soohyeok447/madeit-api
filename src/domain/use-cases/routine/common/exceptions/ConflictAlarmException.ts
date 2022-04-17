import { ConflictException } from '../../../../common/exceptions/ConflictException';

const date: any = {
  1: '일요일',
  2: '월요일',
  3: '화요일',
  4: '수요일',
  5: '목요일',
  6: '금요일',
  7: '토요일',
};

export class ConflictRoutineAlarmException extends ConflictException {
  public constructor(
    conflictDay: number[],
    hour: number,
    minute: number,
    context?: string,
    logMessage?: string,
  ) {
    const deepDays: number[] = JSON.parse(JSON.stringify(conflictDay));

    const sortedDays: number[] = deepDays.sort();

    const convertDateToString: any = (sortedDays: number[]) => {
      if (sortedDays.length === 7) {
        return '매일';
      }

      if (
        sortedDays[0] === 1 &&
        sortedDays[1] === 7 &&
        sortedDays.length === 2
      ) {
        return '주말';
      }

      if (
        sortedDays[0] === 2 &&
        sortedDays[1] === 3 &&
        sortedDays[2] === 4 &&
        sortedDays[3] === 5 &&
        sortedDays[4] === 6 &&
        sortedDays.length === 5
      ) {
        return '평일';
      }

      return sortedDays.map((e) => date[e]);
    };

    const convertedDate: string[] | string = convertDateToString(sortedDays);

    if (hour < 12) {
      super(
        `${convertedDate} 오전 ${hour}시 ${minute}분에는 이미 진행할 루틴이 있습니다`,
        2,
        context,
        logMessage,
      );
    } else if (hour === 12) {
      super(
        `${convertedDate} 오후 12시 ${minute}분에는 이미 진행할 루틴이 있습니다`,
        2,
        context,
        logMessage,
      );
    } else {
      super(
        `${convertedDate} 오후 ${
          hour - 12
        }시 ${minute}분에는 이미 진행할 루틴이 있습니다`,
        2,
        context,
        logMessage,
      );
    }
  }
}

// 1이 일요일 7이 토요일
