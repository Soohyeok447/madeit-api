import * as moment from 'moment-timezone';
import { MomentProvider } from "../../domain/providers/MomentProvider";

moment.tz.setDefault("Asia/Seoul");

export class MomentProviderImpl implements MomentProvider {
  public getRemainingTimeToRunAlarm(
    days: number[],
    hour: number,
    minute: number
  ) {
    const currentDayOfTheWeek = moment().day();
    const currentHour = moment().hour();
    const currentMinute = moment().minute();
    const currentSecond = moment().second();

    const alarmSecond = hour * 3600 + minute * 60;
    const currnetSecond = currentHour * 3600 + currentMinute * 60 + currentSecond;

    if (days.includes(currentDayOfTheWeek)) {
      if (alarmSecond > currnetSecond) {
        return alarmSecond - currnetSecond;
      }
    }

    for (let i = 0; i < days.length; i++){
      if (days[i] > currentDayOfTheWeek) {
        return (days[i] - currentDayOfTheWeek) * 86400 + alarmSecond - currnetSecond;
      }
    }

    const nextWeekDays = days.map(e => e + 7);

    for (let i = 0; i < nextWeekDays.length; i++){
      if (nextWeekDays[i] > currentDayOfTheWeek) {
        return (nextWeekDays[i] - currentDayOfTheWeek) * 86400 + alarmSecond - currnetSecond;
      }
    }
  }
}
