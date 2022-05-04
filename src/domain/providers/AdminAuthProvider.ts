export type Payload = {
  id: string;
  iat: string;
  exp: number;
  iss: string;
};

export abstract class AdminAuthProvider {
  public abstract issueAccessToken(identifier: string): string;

  public abstract issueRefreshToken(identifier: string): string;

  public abstract verify(token: string): Payload;
}
