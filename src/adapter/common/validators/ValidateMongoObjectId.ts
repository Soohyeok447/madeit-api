/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ValidationPipe,
} from '@nestjs/common';
import { InvalidMongoObjectIdException } from '../exceptions/InvalidMongoObjectIdException';

@Injectable()
export class ValidateMongoObjectId implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (value.length !== 24) {
      throw new InvalidMongoObjectIdException();
    }

    return value;
  }
}

export const ValidateCustomDecorators = new ValidationPipe({
  validateCustomDecorators: true,
});
