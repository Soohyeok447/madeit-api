import { ConflictException } from "@nestjs/common";

export class EmailConflictException extends ConflictException {
  constructor() {
    super('이미 가입된 이메일입니다.');
  }
}