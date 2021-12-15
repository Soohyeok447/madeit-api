import { ServiceUnavailableException } from '@nestjs/common';

/**
 * 카카오 플랫폼 서비스의 일시적 내부 장애 상태
   토큰을 강제 만료(폐기) 또는 로그아웃 처리하지 않고 일시적인 장애 메시지로 처리 권장
   해결방법 : 재시도
 */
export class KakaoServerException extends ServiceUnavailableException {
  constructor() {
    super('카카오 서버 에러');
  }
}
