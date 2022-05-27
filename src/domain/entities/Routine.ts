import { AlarmType } from '../common/types/AlarmType';
import { FixedField } from '../common/enums/FixedField';

export class Routine {
  public constructor(
    private _id: string,
    private _userId: string,
    private _title: string,
    private _hour: number,
    private _minute: number,
    private _days: number[],
    private _alarmVideoId: string,
    private _alarmType: AlarmType,
    private _contentVideoId: string,
    private _timerDuration: number,
    private _activation: boolean,
    private _fixedFields: FixedField[],
    private _point: number,
    private _exp: number,
    private _recommendedRoutineId: string,
    private _createdAt: string,
    private _updatedAt: string,
    private _deletedAt: string,
  ) {
    this._id;
    this._userId;
    this._title;
    this._hour;
    this._minute;
    this._days = _days.sort();
    this._alarmVideoId;
    this._alarmType;
    this._contentVideoId;
    this._timerDuration;
    this._activation;
    this._fixedFields = _fixedFields ?? [];
    this._point;
    this._exp;
    this._recommendedRoutineId;
    this._createdAt = _createdAt;
    this._updatedAt = _updatedAt;
    this._deletedAt = _deletedAt;
  }

  public get id(): string {
    return this._id;
  }

  public get userId(): string {
    return this._userId;
  }

  public get title(): string {
    return this._title;
  }

  public get days(): number[] {
    return this._days;
  }

  public get hour(): number {
    return this._hour;
  }

  public get minute(): number {
    return this._minute;
  }

  public get alarmVideoId(): string {
    return this._alarmVideoId;
  }

  public get alarmType(): AlarmType {
    return this._alarmType;
  }

  public get contentVideoId(): string {
    return this._contentVideoId;
  }

  public get timerDuration(): number {
    return this._timerDuration;
  }

  public get activation(): boolean {
    return this._activation;
  }

  public get fixedFields(): FixedField[] {
    return this._fixedFields;
  }

  public get point(): number {
    return this._point;
  }

  public get exp(): number {
    return this._exp;
  }

  public get recommendedRoutineId(): string {
    return this._recommendedRoutineId;
  }

  public get createdAt(): string {
    return this._createdAt;
  }

  public get updatedAt(): string {
    return this._updatedAt;
  }

  public get deletedAt(): string {
    return this._deletedAt;
  }
}
