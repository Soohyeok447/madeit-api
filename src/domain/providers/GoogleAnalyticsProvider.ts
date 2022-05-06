export abstract class GoogleAnalyticsProvider {
  public abstract getActiveUsers(): Promise<number>;
}
