import { ConflictException } from '../../../../common/exceptions/ConflictException';

export class UserAlreadyRegisteredException extends ConflictException {
  constructor() {
    super('유저가 이미 가입 됨', 7);
  }
}
