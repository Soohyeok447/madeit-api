import { ForbiddenException } from '../../../../common/exceptions/ForbiddenException';

export class InvalidRefreshTokenException extends ForbiddenException {
  public constructor() {
    super('refreshToken이 불일치', 2);
  }
}
