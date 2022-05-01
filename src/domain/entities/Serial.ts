import { ObjectId } from '../common/types';

export class Serial {
  public constructor(
    private _id: ObjectId,
    private _userId: ObjectId,
    private _email: string,
    private _serial: string,
    private _createdAt: string,
    private _updatedAt: string,
    private _deletedAt: string,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._email = _email;
    this._serial = _serial;
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

  public get email(): string {
    return this._email;
  }

  public get serial(): string {
    return this._serial;
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
