import { BadRequestException } from '../../../../../common/exceptions/BadRequestException';

export class GoogleEmailNotVerifiedException extends BadRequestException {
  public constructor() {
    super('승인되지 않은 구글 계정', 6);
  }
}
