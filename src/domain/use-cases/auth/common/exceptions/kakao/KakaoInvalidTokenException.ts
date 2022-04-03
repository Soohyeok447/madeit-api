import { BadRequestException } from '../../../../../common/exceptions/BadRequestException';

/**
* 필수 인자가 포함되지 않은 경우나 호출 인자값의 데이터 타입이 적절하지 않거나 허용된 범위를 벗어난 경우
  요청 시 주어진 액세스 토큰 정보가 잘못된 형식인 경우로 올바른 형식으로 요청했는지 확인
*/
export class KakaoInvalidTokenException extends BadRequestException {
  public constructor() {
    super('유효하지 않은 카카오 토큰', 3);
  }
}
