import { ConflictException } from '@nestjs/common';

export class UsernameConflictException extends ConflictException {
  constructor() {
    super('중복된 닉네임입니다.');
  }
}
