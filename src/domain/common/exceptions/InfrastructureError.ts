import { HttpException } from '@nestjs/common';

export class InfrastructureError extends HttpException {
  constructor(body) {
    super({ message: '인프라 예외발생', body }, 500);
  }
}
