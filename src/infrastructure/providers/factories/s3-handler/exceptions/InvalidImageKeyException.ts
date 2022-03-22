import { HttpException } from '../../../../../domain/common/exceptions/HttpException';

export class InvalidImageKeyException extends HttpException {
  constructor() {
    super('잘못된 이미지 타입입니다', 76, 500);
  }
}
