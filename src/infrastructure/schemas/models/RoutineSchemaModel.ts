import { FixedField } from '../../../domain/common/enums/FixedField';

export class RoutineSchemaModel {
  readonly _id?: string;

  readonly user_id?: string;

  readonly title?: string;

  readonly hour?: number;

  readonly minute?: number;

  readonly days?: number[];

  readonly alarm_video_id?: string;

  readonly content_video_id?: string;

  readonly timer_duration?: number;

  readonly activation?: boolean;

  readonly fixed_fields?: FixedField[];

  readonly exp?: number;

  readonly point?: number;
}
