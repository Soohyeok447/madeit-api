import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "../../users/entities/user.entity";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "../../users/users.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userRepository: UserRepository,
  ) {
    super({
      //현재 요청의 Autorization Header 속에 있는 JWT를 보고 그대로 전달
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //payload와 decrypt를 위한 secret
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    })
  }

  //위에서 토큰유효성이 체크되면 return값을 @UseGuards(AuthGuard())를 이용한
  //모든 요청의 Request Object에 들어가게 된다.
  async validate(payload: any) {
    try {
      const { email, iss } = payload;

      const user = await this.userRepository.findOneByEmail(email);

      if (!user || iss != 'futurekitchlab') {
        throw new UnauthorizedException(`wrong payload`);
      }

      return user; 
    } catch (err) {
      throw err;
    }
  }
}