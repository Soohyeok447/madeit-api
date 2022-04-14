export abstract class LoggerProvider {
  public abstract info(message: string): void;

  public abstract error(message: string): void;

  public abstract setContext(context: string): void;

  public abstract getContext(): string;
}
