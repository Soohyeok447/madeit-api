import { UnauthorizedException } from '../../../domain/common/exceptions/UnauthorizedException';

export function throwUnauthorizedException(info: any, err: any) {
  if (info.message === 'jwt expired') {
    throw err || new UnauthorizedException('토큰 만료', 80);
  }

  if (info.message === 'invalid signature') {
    throw err || new UnauthorizedException('유효하지 않은 서명', 81);
  }

  if (info.message === 'No auth token') {
    throw err || new UnauthorizedException('토큰이 없음', 82);
  }

  if (info.message === 'jwt malformed') {
    throw err || new UnauthorizedException('비정상적인 토큰', 83);
  }

  if (info.message === 'invalid token') {
    throw err || new UnauthorizedException('유효하지 않은 토큰', 84);
  }

  throw new UnauthorizedException(info.message, 85);
}
