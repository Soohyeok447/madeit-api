import { HttpException } from '../../../../../domain/common/exceptions/HttpException';

export class InvalidImageKeyException extends HttpException {
  public constructor(type: string) {
    super(
      '잘못된 이미지 타입입니다',
      76,
      500,
      null,
      `유효하지 않은 Image type Enum. type - ${type} `,
    );
  }
}
