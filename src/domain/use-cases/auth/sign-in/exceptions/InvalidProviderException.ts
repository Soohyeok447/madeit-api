import { BadRequestException } from "../../../../common/exceptions/BadRequestException";

export class InvalidProviderException extends BadRequestException {
  constructor() {
    super('유효하지 않은 provider query', 1);
  }
}
