import { NotFoundException } from '../NotFoundException';

export class UserNotFoundException extends NotFoundException {
  public constructor(context?: string, logMessage?: string) {
    super(`유저를 찾을 수 없음`, 70, context, logMessage);
  }
}
