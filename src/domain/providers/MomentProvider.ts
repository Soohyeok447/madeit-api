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

  public abstract isToday(createdAt: string): boolean;
}
