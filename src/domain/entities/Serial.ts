import { ObjectId } from '../common/types';

export class Serial {
  public constructor(
    private _id: ObjectId,
    private _userId: ObjectId,
    private _email: string,
    private _serial: string,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._email = _email;
    this._serial = _serial;
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
}
