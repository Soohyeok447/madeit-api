import { UnauthorizedException } from '../../../domain/common/exceptions/UnauthorizedException';

export function throwUnauthorizedException(info: any, err: any): void {
  if (info.message === 'jwt expired') {
    throw err || new UnauthorizedException('토큰 만료', 80, null, `토큰 만료`);
  }

  if (info.message === 'invalid signature') {
    throw (
      err ||
      new UnauthorizedException(
        '유효하지 않은 서명',
        81,
        null,
        `유효하지 않은 서명`,
      )
    );
  }

  if (info.message === 'No auth token') {
    throw (
      err || new UnauthorizedException('토큰이 없음', 82, null, `토큰이 없음`)
    );
  }

  if (info.message === 'jwt malformed') {
    throw (
      err ||
      new UnauthorizedException('비정상적인 토큰', 83, null, `비정상적인 토큰`)
    );
  }

  if (info.message === 'invalid token') {
    throw (
      err ||
      new UnauthorizedException(
        '유효하지 않은 토큰',
        84,
        null,
        `유효하지 않은 토큰`,
      )
    );
  }

  throw new UnauthorizedException(
    info.message,
    85,
    null,
    `알 수 없는 authorization error`,
  );
}
