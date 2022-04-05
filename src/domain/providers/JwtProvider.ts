export abstract class JwtProvider {
  public abstract signAccessToken(id: string): string;

  public abstract signRefreshToken(id: string): string;
}
