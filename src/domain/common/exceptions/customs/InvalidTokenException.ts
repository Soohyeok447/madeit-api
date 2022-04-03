import { UnauthorizedException } from '../UnauthorizedException';

export class InvalidTokenException extends UnauthorizedException {
  public constructor() {
    super('유효하지 않은 issuer', 90);
  }
}
