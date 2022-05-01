import * as moment from 'moment-timezone';
import { CompleteRoutine } from '../../domain/entities/CompleteRoutine';
import { MomentProvider } from '../../domain/providers/MomentProvider';

moment.tz.setDefault('Asia/Seoul');

export class MomentProviderImpl implements MomentProvider {
  public isToday(createdAt: moment.Moment): boolean {
    return moment(createdAt).isSameOrAfter(moment().format('YYYY-MM-DD'));
  }

  public parseCreatedAt(createdAt: moment.Moment): string {
    return moment(createdAt).format('YYYY/MM/DD HH:mm:ss');
  }

  public getCountOfRoutinesCompletedInThisMonth(
    completeRoutines: CompleteRoutine[],
  ): number {
    const countOfRoutinesCompletedInThisMonth: CompleteRoutine[] =
      completeRoutines
        .map((e) => {
          if (moment(e.createdAt).isSameOrAfter(moment().format('YYYY-MM')))
            return e;
        })
        .filter((e) => e);

    return countOfRoutinesCompletedInThisMonth.length;
  }

  public getRemainingTimeToRunAlarm(
    days: number[],
    hour: number,
    minute: number,
  ): number {
    const currentDayOfTheWeek: number = moment().day();
    const currentHour: number = moment().hour();
    const currentMinute: number = moment().minute();
    const currentSecond: number = moment().second();

    const alarmSecond: number = hour * 3600 + minute * 60;
    const currnetSecond: number =
      currentHour * 3600 + currentMinute * 60 + currentSecond;

    if (days.includes(currentDayOfTheWeek)) {
      if (alarmSecond > currnetSecond) {
        return alarmSecond - currnetSecond;
      }
    }

    let i: number;
    for (i = 0; i < days.length; i++) {
      if (days[i] > currentDayOfTheWeek) {
        return (
          (days[i] - currentDayOfTheWeek) * 86400 + alarmSecond - currnetSecond
        );
      }
    }

    const nextWeekDays: number[] = days.map((e) => e + 7);

    for (i = 0; i < nextWeekDays.length; i++) {
      if (nextWeekDays[i] > currentDayOfTheWeek) {
        return (
          (nextWeekDays[i] - currentDayOfTheWeek) * 86400 +
          alarmSecond -
          currnetSecond
        );
      }
    }
  }
}
