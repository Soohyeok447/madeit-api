import { ForbiddenException } from '../../../../common/exceptions/ForbiddenException';

export class NoRefreshTokenException extends ForbiddenException {
  constructor() {
    super('로그아웃한 상태입니다', 1);
  }
}
