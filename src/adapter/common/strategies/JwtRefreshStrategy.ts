import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InvalidTokenException } from '../../../domain/common/exceptions/customs/InvalidTokenException';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt_refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_REFRESH_TOKEN_SECRET}`,
    });
  }

  async validate(payload: any) {
    const { id, iss } = payload;

    if (iss != process.env.JWT_ISSUER) {
      throw new InvalidTokenException();
    }

    return { id };
  }
}
