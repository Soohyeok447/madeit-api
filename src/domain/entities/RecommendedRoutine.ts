import { Category } from '../common/enums/Category';
import { FixedField } from '../common/enums/FixedField';
import { ObjectId } from '../common/types';

export class RecommendedRoutine {
  public constructor(
    private _id: ObjectId,
    private _title: string,
    private _hour: number,
    private _minute: number,
    private _days: number[],
    private _alarmVideoId: string,
    private _contentVideoId: string,
    private _timerDuration: number,
    private _thumbnailId: ObjectId,
    private _cardnewsId: ObjectId,
    private _category: Category,
    private _introduction: string,
    private _price: number,
    private _fixedFields: FixedField[],
    private _point: number,
    private _exp: number,
  ) {
    this._id = _id;
    this._title = _title;
    this._hour = _hour;
    this._minute = _minute;
    this._days = _days.length > 0 ? _days.sort() : null;
    this._alarmVideoId = _alarmVideoId;
    this._contentVideoId = _contentVideoId;
    this._timerDuration = _timerDuration;
    this._thumbnailId = _thumbnailId;
    this._cardnewsId = _cardnewsId;
    this._category = _category;
    this._introduction = _introduction;
    this._price = _price;
    this._fixedFields = _fixedFields.length > 0 ? _fixedFields : [];
    this._point = _point;
    this._exp = _exp;
  }

  public get id(): string {
    return this._id.toString();
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

  public get contentVideoId(): string {
    return this._contentVideoId;
  }

  public get timerDuration(): number {
    return this._timerDuration;
  }

  public get thumbnailId(): string {
    return this._thumbnailId ? this._thumbnailId.toString() : null;
  }

  public get cardnewsId(): string {
    return this._cardnewsId ? this._cardnewsId.toString() : null;
  }

  public get category(): Category {
    return this._category;
  }

  public get introduction(): string {
    return this._introduction;
  }

  public get price(): number {
    return this._price;
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
}
