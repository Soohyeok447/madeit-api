import { Injectable } from '@nestjs/common';
import { Category } from '../common/enums/Category';
import { FixedField } from '../common/enums/FixedField';

@Injectable()
export class RecommendedRoutine {
  constructor(
    private _id: string,
    private _title: string,
    private _hour: number,
    private _minute: number,
    private _days: number[],
    private _alarmVideoId: string,
    private _contentVideoId: string,
    private _timerDuration: number,
    private _thumbnailId: string,
    private _cardnewsId: string,
    private _category: Category,
    private _introduction: string,
    private _price: number,
    private _fixedFields: FixedField[],
    private _point: number,
    private _exp: number,
  ) {
    this._id;
    this._title;
    this._hour;
    this._minute;
    this._days;
    this._alarmVideoId;
    this._contentVideoId;
    this._timerDuration;
    this._thumbnailId;
    this._cardnewsId;
    this._category;
    this._introduction;
    this._price;
    this._fixedFields;
    this._point;
    this._exp;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get days() {
    if (!this._days.length) return null;

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

  get thumbnailId() {
    return this._thumbnailId;
  }

  get cardnewsId() {
    return this._cardnewsId;
  }

  get category() {
    return this._category;
  }

  get introduction() {
    return this._introduction;
  }

  get price() {
    return this._price;
  }

  get fixedFields() {
    return !this._fixedFields.length ? [] : this._fixedFields;
  }

  get point() {
    return this._point;
  }

  get exp() {
    return this._exp;
  }
}
