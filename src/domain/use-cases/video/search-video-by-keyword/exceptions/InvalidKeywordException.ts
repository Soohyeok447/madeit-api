import { BadRequestException } from '../../../../common/exceptions/BadRequestException';

export class InvalidKeywordException extends BadRequestException {
  public constructor() {
    super('유효하지 않은 요청입니다', 3);
  }
}
