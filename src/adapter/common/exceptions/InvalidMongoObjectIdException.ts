import { BadRequestException } from '../../../domain/common/exceptions/BadRequestException';

export class InvalidMongoObjectIdException extends BadRequestException {
  public constructor(id: string) {
    super(
      '유효하지 않은 objectId',
      93,
      null,
      `유효하지 않은 objectId => ${id}`,
    );
  }
}
