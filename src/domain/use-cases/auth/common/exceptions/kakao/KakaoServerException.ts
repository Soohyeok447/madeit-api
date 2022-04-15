import { ServiceUnavailableException } from '../../../../../common/exceptions/ServiceUnavailableException';

/**
 * 카카오 플랫폼 서비스의 일시적 내부 장애 상태
   토큰을 강제 만료(폐기) 또는 로그아웃 처리하지 않고 일시적인 장애 메시지로 처리 권장
   해결방법 : 재시도
 */
export class KakaoServerException extends ServiceUnavailableException {
  public constructor(context?: string, logMessage?: string) {
    super(
      '카카오 플랫폼 서비스의 일시적 내부 장애 상태, 재시도 해보세요',
      2,
      context,
      logMessage,
    );
  }
}
