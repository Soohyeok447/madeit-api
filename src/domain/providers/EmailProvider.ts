export abstract class EmailProvider {
  public abstract send(
    email: string,
    subject: string,
    message: string,
  ): Promise<void>;
}
