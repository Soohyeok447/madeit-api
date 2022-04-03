export abstract class MomentProvider {
  public abstract getRemainingTimeToRunAlarm(
    days: number[],
    hour: number,
    minute: number,
  );
}
