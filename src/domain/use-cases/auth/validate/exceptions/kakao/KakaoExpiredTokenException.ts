import { BadRequestException } from '../../../../../common/exceptions/BadRequestException';

/**
 * 유효하지 않은 앱키나 액세스 토큰으로 요청한 경우
   토큰 값이 잘못되었거나 만료되어 유효하지 않은 경우로 토큰 갱신 필요
 */
export class KakaoExpiredTokenException extends BadRequestException {
  constructor() {
    super('만료된 카카오 토큰', 4);
  }
}
