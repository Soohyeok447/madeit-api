import { UnauthorizedException } from '../UnauthorizedException';

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super('유효하지 않은 issuer', 90);
  }
}
