import * as moment from 'moment-timezone';
import { MomentProvider } from "../../domain/providers/MomentProvider";

moment.tz.setDefault("Asia/Seoul");

export class MomentProviderImpl implements MomentProvider {
  public getRemainingTimeToRunAlarm(
    days: number[],
    hour: number,
    minute: number
  ): number {
    return 30
  }
}
