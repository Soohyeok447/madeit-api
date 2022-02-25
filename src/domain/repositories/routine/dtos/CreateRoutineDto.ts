export class CreateRoutineDto {
  public userId: string;

  public title: string;

  public hour: number;

  public minute: number;

  public days: number[];

  public alarm_video_id?: string;

  public content_video_id?: string;

  public timer_duration?: number;
}
