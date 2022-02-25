export abstract class MomentProvider {
  abstract getRemainingTimeToRunAlarm(days:number[], hour:number, minute: number): number;
}
