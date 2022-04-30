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
  public transform(value: string, metadata: ArgumentMetadata): string {
    if (value.length !== 24) {
      throw new InvalidMongoObjectIdException(value);
    }

    return value;
  }
}

export const ValidateCustomDecorators: ValidationPipe = new ValidationPipe({
  validateCustomDecorators: true,
});
