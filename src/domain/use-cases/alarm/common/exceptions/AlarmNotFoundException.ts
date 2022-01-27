import { NotFoundException } from '@nestjs/common';

export class AlarmNotFoundException extends NotFoundException {
  constructor() {
    super('알람이 없음');
  }
}
