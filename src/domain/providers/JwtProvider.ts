export abstract class JwtProvider {
  abstract signAccessToken(id: string): string;

  abstract signRefreshToken(id: string): string;
}
