import { NotFoundException } from '../../../../domain/common/exceptions/NotFoundException';

export class NotFoundImageException extends NotFoundException {
  constructor() {
    super('이미지 없음', 75);
  }
}