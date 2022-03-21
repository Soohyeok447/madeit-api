export class AddRoutineUsecaseParams {
  public userId: string;

  public title: string;

  public hour: number;

  public minute: number;

  public days: number[];

  public alarmVideoId?: string;

  public contentVideoId?: string;

  public timerDuration?: number;

  public recommendedRoutineId?: string;
}
