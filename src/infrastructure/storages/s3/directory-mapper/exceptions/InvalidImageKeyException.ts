import { HttpException } from '../../../../../domain/common/exceptions/HttpException';

export class InvalidImageKeyException extends HttpException {
  public constructor() {
    super('잘못된 이미지 키값입니다', 76, 500);
  }
}
