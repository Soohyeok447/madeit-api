import { BadRequestException } from '../../../../domain/common/exceptions/BadRequestException';

export class SocketHangUpException extends BadRequestException {
  public constructor(context?: string, logMessage?: string) {
    super(
      '연결 지연으로 검색에 실패했습니다. 잠시후 재시도해주세요.',
      4,
      context,
      logMessage,
    );
  }
}
