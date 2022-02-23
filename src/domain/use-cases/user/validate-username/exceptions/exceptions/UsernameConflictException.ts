import { ConflictException } from "../../../../../common/exceptions/ConflictException";


export class UsernameConflictException extends ConflictException {
  constructor() {
    super('닉네임 중복', 2);
  }
}
