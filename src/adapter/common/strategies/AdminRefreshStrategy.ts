import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InvalidTokenIssuerException } from '../../../domain/common/exceptions/customs/InvalidTokenException';

@Injectable()
export class AdminRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt_admin_refresh',
) {
  public constructor() {
    super({
      //현재 요청의 Autorization Header 속에 있는 JWT를 보고 그대로 전달
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //payload와 decrypt를 위한 secret
      secretOrKey: `${process.env.JWT_ADMIN_REFRESH_TOKEN_SECRET}`,
    });
  }

  //위에서 토큰유효성이 체크되면 return값을 @UseGuards(AuthGuard())를 이용한
  //모든 요청의 Request Object에 들어가게 된다.
  public async validate(payload: any): Promise<{
    id: any;
  }> {
    const { id, iss } = payload;

    if (iss !== process.env.JWT_ISSUER) {
      throw new InvalidTokenIssuerException();
    }

    return { id };
  }
}
