import { HttpException } from '../../../../domain/common/exceptions/HttpException';

export class DeleteObjectToS3Error extends HttpException {
  public constructor(context?: string, logMessage?: string) {
    super(`cloud에 object 저장 실패`, 78, 500, context, logMessage);
  }
}
