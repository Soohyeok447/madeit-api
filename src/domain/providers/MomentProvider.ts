export abstract class MomentProvider {
  abstract getDuration(days:number[], hour:number, minute: number): number;
}
