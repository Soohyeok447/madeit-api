import { Injectable } from '@nestjs/common';
import { FixedField } from '../common/enums/FixedField';

@Injectable()
export class Routine {
  constructor(
    private _id: string,
    private _title: string,
    private _hour: number,
    private _minute: number,
    private _days: number[],
    private _alarmVideoId: string,
    private _contentVideoId: string,
    private _timerDuration: number,
    private _activation: boolean,
    private _fixedFields: FixedField[],
    private _point: number,
    private _exp: number,
    private _recommendedRoutineId: string,
  ) {
    this._id;
    this._title;
    this._hour;
    this._minute;
    this._days;
    this._alarmVideoId;
    this._contentVideoId;
    this._timerDuration;
    this._activation;
    this._fixedFields;
    this._point;
    this._exp;
    this._recommendedRoutineId;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get days() {
    return this._days.sort();
  }

  get hour() {
    return this._hour;
  }

  get minute() {
    return this._minute;
  }

  get alarmVideoId() {
    return this._alarmVideoId;
  }

  get contentVideoId() {
    return this._contentVideoId;
  }

  get timerDuration() {
    return this._timerDuration;
  }

  get activation() {
    return this._activation;
  }

  get fixedFields() {
    if (this._fixedFields) {
      return !this._fixedFields.length ? [] : this._fixedFields;
    }

    return [];
  }

  get point() {
    return this._point;
  }

  get exp() {
    return this._exp;
  }

  get recommendedRoutineId() {
    return this._recommendedRoutineId;
  }
}
