import { BadRequestException } from '../../../../common/exceptions/BadRequestException';

export class InvalidAlarmTypeException extends BadRequestException {
  public constructor(alarmType: string, context?: string, logMessage?: string) {
    super(`유효하지 않은 알람타입 ${alarmType}입니다.`, 3, context, logMessage);
  }
}
