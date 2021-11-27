import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt_refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_REFRESH_TOKEN_SECRET}`,
    })
  }

  async validate(payload: any) {
    const { email, id, iss } = payload;

    if (iss != process.env.JWT_ISSUER) {
      throw new UnauthorizedException(`wrong payload`);
    }

    return { email, id };
  }
}