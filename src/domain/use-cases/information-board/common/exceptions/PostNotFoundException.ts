import { NotFoundException } from '../../../../common/exceptions/NotFoundException';

export class PostNotFoundException extends NotFoundException {
  public constructor(context?: string, logMessage?: string) {
    super(`존재하지 않는 게시글`, 79, context, logMessage);
  }
}
