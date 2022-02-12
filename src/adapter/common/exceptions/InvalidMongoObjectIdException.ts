import { BadRequestException } from '@nestjs/common';

export class InvalidMongoObjectIdException extends BadRequestException {
  constructor() {
    super('유효하지 않은 objectId');
  }
}
