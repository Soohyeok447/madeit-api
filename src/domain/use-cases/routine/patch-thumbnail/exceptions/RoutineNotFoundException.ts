import { NotFoundException } from '@nestjs/common';

export class RoutineNotFoundException extends NotFoundException {
  constructor() {
    super(`루틴을 찾을 수 없음`);
  }
}
