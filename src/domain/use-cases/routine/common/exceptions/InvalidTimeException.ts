import { BadRequestException } from '../../../../common/exceptions/BadRequestException';

export class InvalidTimeException extends BadRequestException {
  constructor(time: number) {
    super(`유효하지않은 time ${time}`, 1);
  }
}
