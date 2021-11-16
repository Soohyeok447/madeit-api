import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "../../users/entities/user.entity";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "../../users/users.repository";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    })
  }

  async validate(payload: any) {
    console.log(payload);
    const { email, issuer } = payload;

    const user = await this.userRepository.findOneByEmail(email);

    if (!user || issuer != 'futurekitchlab') {
      throw new UnauthorizedException(`wrong payload`);
    }

    return { email: user.email, id: user.id }; //나중에 주로 쓰는 find 메서드만 쓰도록 리팩토링
  }
}