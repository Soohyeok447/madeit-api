import { ConflictException } from '../../../../common/exceptions/ConflictException';

export class UsernameConflictException extends ConflictException {
  public constructor(context?: string, logMessage?: string) {
    super('닉네임 중복', 2, context, logMessage);
  }
}
