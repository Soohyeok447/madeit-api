/* eslint-disable @typescript-eslint/ban-types */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ValidationError,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BadRequestException } from '../../../domain/common/exceptions/BadRequestException';
import { LoggerProvider } from '../../../domain/providers/LoggerProvider';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  public constructor(private readonly logger: LoggerProvider) {}

  public async transform(
    value: any,
    { metatype }: ArgumentMetadata,
  ): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object: any = plainToClass(metatype, value);

    const errors: ValidationError[] = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException(
        'Validation failed',
        93,
        null,
        `유효성 검사 실패\nbody로 들어온 object => ${JSON.stringify(
          object,
        )} \nvalidation 결과 => ${JSON.stringify(errors)} `,
      );
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
