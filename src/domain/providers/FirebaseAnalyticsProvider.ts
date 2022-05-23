export abstract class FirebaseAnalyticsProvider {
  public abstract getInstallationCount(): Promise<number>;
}
