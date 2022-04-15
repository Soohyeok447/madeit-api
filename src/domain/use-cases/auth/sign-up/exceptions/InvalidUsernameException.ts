import { BadRequestException } from '../../../../common/exceptions/BadRequestException';

export class InvalidUsernameException extends BadRequestException {
  public constructor(context?: string, logMessage?: string) {
    super('닉네임은 2자 이상 8자 이하여야 합니다', 1, context, logMessage);
  }
}
