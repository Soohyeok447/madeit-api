import { HttpException } from '../HttpException';

export class InfrastructureError extends HttpException {
  public constructor() {
    super('infrastructer error', 91, 500);
  }
}
