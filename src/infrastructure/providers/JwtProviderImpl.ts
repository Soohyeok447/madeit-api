import { JwtService } from "@nestjs/jwt";
import { JwtProvider } from "../../domain/providers/JwtProvider";

export class JwtProviderImpl implements JwtProvider {
  constructor(
    public jwtService: JwtService = new JwtService({})
  ) { }

  public signAccessToken(id: string): string {
    const accessToken = this.jwtService.sign(
      { id },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
        issuer: `${process.env.JWT_ISSUER}`,
      },
    );

    return accessToken;
  }
  public signRefreshToken(id: string): string {
    const refreshToken = this.jwtService.sign(
      { id },
      {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
        issuer: `${process.env.JWT_ISSUER}`,
      },
    );

    return refreshToken
  }
}