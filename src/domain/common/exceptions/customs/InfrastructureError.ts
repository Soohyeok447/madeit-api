import { HttpException } from '../HttpException';

export class InfrastructureError extends HttpException {
  constructor() {
    super('infrastructer error', 91, 500);
  }
}
