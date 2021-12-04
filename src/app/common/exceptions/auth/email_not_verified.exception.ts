import { NotAcceptableException } from "@nestjs/common";

export class EmailNotVerifiedException extends NotAcceptableException {
  constructor() {
    super('승인되지 않은 이메일입니다.');
  }
}