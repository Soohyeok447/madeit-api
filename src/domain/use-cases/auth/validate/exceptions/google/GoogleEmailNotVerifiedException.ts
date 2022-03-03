import { BadRequestException } from '../../../../../common/exceptions/BadRequestException';

export class GoogleEmailNotVerifiedException extends BadRequestException {
  constructor() {
    super('승인되지 않은 구글 계정', 6);
  }
}
