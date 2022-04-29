import { ObjectId } from '../common/types';

export class ExchangeToken {
  public constructor(
    private _id: ObjectId,
    private _userId: ObjectId,
    private _token: string,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._token = _token;
  }

  public get id(): string {
    return this._id.toString();
  }

  public get userId(): string {
    return this._userId.toString();
  }

  public get token(): string {
    return this._token;
  }
}
