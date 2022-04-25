export abstract class EmailProvider {
  public abstract send(email: string, message: string): Promise<void>;
}
