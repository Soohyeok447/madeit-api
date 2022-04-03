import { BadRequestException } from '@nestjs/common';

export class InvalidRoutineIdException extends BadRequestException {
  public constructor() {
    super('유효하지 않은 루틴id');
  }
}
