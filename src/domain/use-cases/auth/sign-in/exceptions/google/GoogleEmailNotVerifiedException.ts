import { NotAcceptableException } from '@nestjs/common';

export class GoogleEmailNotVerifiedException extends NotAcceptableException {
  constructor() {
    super('승인되지 않은 구글 이메일');
  }
}
