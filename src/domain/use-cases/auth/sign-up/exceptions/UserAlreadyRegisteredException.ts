import { ConflictException } from '../../../../common/exceptions/ConflictException';

export class UserAlreadyRegisteredException extends ConflictException {
  public constructor(context?: string, logMessage?: string) {
    super('유저가 이미 가입 됨', 7, context, logMessage);
  }
}
