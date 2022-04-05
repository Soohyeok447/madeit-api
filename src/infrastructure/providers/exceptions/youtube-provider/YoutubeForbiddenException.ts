import { NotFoundException } from '../../../../domain/common/exceptions/NotFoundException';

export class YoutubeForbiddenException extends NotFoundException {
  public constructor() {
    super(
      '서버에서 Youtube API 인증에 문제가 생겼습니다. 빠른 시간내로 고치겠습니다.',
      5,
    );
  }
}
