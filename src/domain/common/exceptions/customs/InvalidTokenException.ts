import { UnauthorizedException } from '../UnauthorizedException';

export class InvalidTokenIssuerException extends UnauthorizedException {
  public constructor() {
    super('유효하지 않은 issuer', 90);
  }
}
