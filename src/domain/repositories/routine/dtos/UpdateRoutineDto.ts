export class UpdateRoutineDto {
  public title?: string;

  public hour?: number;

  public minute?: number;

  public days?: number[];

  public alarmVideoId?: string;

  public contentVideoId?: string;

  public timerDuration?: number;

  public activation?: boolean;
}
