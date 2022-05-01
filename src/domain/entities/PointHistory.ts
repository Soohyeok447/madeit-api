import { ObjectId } from '../common/types';

export class PointHistory {
  public constructor(
    private _id: ObjectId,
    private _userId: ObjectId,
    private _messsage: string,
    private _point: number,
    private _createdAt: moment.Moment,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._messsage = _messsage;
    this._point = _point;
    this._createdAt = _createdAt;
  }

  public get id(): string {
    return this._id.toString();
  }

  public get userId(): string {
    return this._userId.toString();
  }

  public get message(): string {
    return this._messsage;
  }

  public get point(): number {
    return this._point;
  }

  public get createdAt(): moment.Moment {
    return this._createdAt;
  }
}
