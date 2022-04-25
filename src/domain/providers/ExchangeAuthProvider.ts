export abstract class ExchangeAuthProvider {
  public abstract issue(userId: string): Promise<string>;

  public abstract verify(token: string): Promise<boolean>;
}
