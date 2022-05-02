import { NotFoundException } from '../../../../common/exceptions/NotFoundException';

export class AdminNotFoundException extends NotFoundException {
  public constructor(context?: string, logMessage?: string) {
    super('존재하지 않는 어드민', 86, context, logMessage);
  }
}
