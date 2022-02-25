import * as moment from 'moment-timezone';
import { MomentProvider } from "../../domain/providers/MomentProvider";

moment.tz.setDefault("Asia/Seoul");

export class MomentProviderImpl implements MomentProvider {
  public getRemainingTimeToRunAlarm(
    days: number[],
    hour: number,
    minute: number
  ): number {
    const currentDayOfTheWeek = moment().day();
    console.log(`currentDayOfTheWeek => ${currentDayOfTheWeek}`)
    console.log(`days => ${days}`)

    const currentHour = moment().hour();
    const currentMinute = moment().minute();
    const currentSecond = moment().second();

    const alarmSecond = hour * 3600 + minute * 60;
    const currnetSecond = currentHour * 3600 + currentMinute * 60 + currentSecond;
    console.log(`alarmSecond => ${alarmSecond}`)
    console.log(`currnetSecond => ${currnetSecond}`)


    const index = days.indexOf(currentDayOfTheWeek);
    //만약에 오늘이 금(5)인데 days에 5가 없다면?

    //days에 오늘 요일이 포함 돼있다면
    if (days.includes(currentDayOfTheWeek)) {
      //알람이 실행되기 이전이라면
      if (alarmSecond - currnetSecond > 0) {
        return alarmSecond - currnetSecond;
      }
    }

    //오늘이 days에 포함 돼있으면
    if (index >= 0) {
      console.log('잇다')
    }

    //오늘 요일의 index가 마지막 index라면
    if (days[days.length - 1] === days[index]) {
      return ((days[0] + 7 - currentDayOfTheWeek) * 86400) + (alarmSecond - currnetSecond);
    }

    console.log('오늘 알람 실행되는 날')
    //오늘 요일의 index가 마지막 index가 아니라면
    return ((7 - currentDayOfTheWeek) * 86400) + (alarmSecond - currnetSecond);

  }
}
