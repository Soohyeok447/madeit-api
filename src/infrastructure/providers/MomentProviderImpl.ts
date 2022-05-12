import * as moment from 'moment-timezone';
import { CompleteRoutine } from '../../domain/entities/CompleteRoutine';
import { MomentProvider } from '../../domain/providers/MomentProvider';

moment.tz.setDefault('Asia/Seoul');

export class MomentProviderImpl implements MomentProvider {
  public momentToISOString(createdAt: string): string {
    return moment(createdAt).toISOString();
  }

  public isInToday(time: string): boolean {
    if (!time) return false;

    return moment(time).isSameOrAfter(moment().subtract(1, 'd'));
  }

  public isInLastWeek(time: string): boolean {
    if (!time) return false;

    return moment(time).isSameOrAfter(moment().subtract(7, 'd'));
  }

  public isInLastMonth(time: string): boolean {
    if (!time) return false;

    return moment(time).isSameOrAfter(moment().subtract(30, 'd'));
  }

  public isBetween(time: string, offset: number): boolean {
    if (!time) return false;

    return moment(time).isBetween(
      '2022-04-24',
      moment('2022-04-24').add(7 * offset, 'd'),
    );
  }

  public parseCreatedAt(createdAt: string): string {
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

  /**
   *
   * 필요한것
   */
}
