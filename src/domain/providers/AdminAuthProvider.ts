export abstract class AdminAuthProvider {
  public abstract issueAccessToken(identifier: string): string;

  public abstract issueRefreshToken(identifier: string): string;
}
