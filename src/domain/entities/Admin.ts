import { ObjectId } from '../common/types';

export class Admin {
  public constructor(
    private _id: ObjectId,
    private _identifier: string,
    private _password: string,
  ) {
    this._id = _id;
    this._identifier = _identifier;
    this._password = _password;
  }

  public get id(): string {
    return this._id.toString();
  }

  public get identifier(): string {
    return this._identifier;
  }

  public get password(): string {
    return this._password;
  }
}
