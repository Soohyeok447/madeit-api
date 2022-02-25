export class ModifyRoutineUsecaseParams {
  public userId: string;

  public routineId: string;

  public title?: string;

  public hour?: number;

  public minute?: number;

  public days?: number[];

  public alarmVideoId?: string;

  public contentVideoId?: string;

  public timerDuration?: number;
}
