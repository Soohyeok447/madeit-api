import { CompleteRoutine } from '../entities/CompleteRoutine';

export abstract class MomentProvider {
  public abstract getRemainingTimeToRunAlarm(
    days: number[],
    hour: number,
    minute: number,
  );

  public abstract getCountOfRoutinesCompletedInThisMonth(
    completeRoutines: CompleteRoutine[],
  ): number;

  public abstract parseCreatedAt(createdAt: string): string;

  public abstract momentToISOString(createdAt: string): string;

  public abstract isBetween(time: string, offset: number): boolean;

  public abstract isInToday(time: string): boolean;

  public abstract isInLastWeek(time: string): boolean;

  public abstract isInLastMonth(time: string): boolean;
}
