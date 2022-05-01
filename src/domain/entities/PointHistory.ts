import { ObjectId } from '../common/types';

export class PointHistory {
  public constructor(
    private _id: ObjectId,
    private _userId: ObjectId,
    private _messsage: string,
    private _point: number,
    private _createdAt: string,
    private _updatedAt: string,
    private _deletedAt: string,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._messsage = _messsage;
    this._point = _point;
    this._createdAt = _createdAt;
    this._updatedAt = _updatedAt;
    this._deletedAt = _deletedAt;
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
