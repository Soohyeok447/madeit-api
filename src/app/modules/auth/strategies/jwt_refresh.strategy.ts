import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "../../users/users.repository";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt_refresh') {
  constructor(
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
    })
  }

  async validate(payload: any) {
    const { email, iss } = payload;

    const user = await this.userRepository.findOneByEmail(email);

    if (!user || iss != 'futurekitchlab') {
      throw new UnauthorizedException(`wrong payload`);
    }

    return user;
  }
}