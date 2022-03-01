import { BadRequestException } from '../../../domain/common/exceptions/BadRequestException';

export class InvalidMongoObjectIdException extends BadRequestException {
  constructor() {
    super('유효하지 않은 objectId', 93);
  }
}
