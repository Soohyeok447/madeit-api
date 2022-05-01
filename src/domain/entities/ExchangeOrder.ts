import { ObjectId } from '../common/types';

export class ExchangeOrder {
  public constructor(
    private _id: ObjectId,
    private _userId: ObjectId,
    private _amount: number,
    private _bank: string,
    private _account: string,
    private _state: string,
    private _createdAt: string,
    private _updatedAt: string,
    private _deletedAt: string,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._amount = _amount;
    this._bank = _bank;
    this._account = _account;
    this._state = '환급 전';
    this._createdAt = _createdAt;
    this._updatedAt = _updatedAt;
    this._deletedAt = _deletedAt;
  }

  public set state(state: string) {
    this._state = state;
  }

  public get id(): string {
    return this._id.toString();
  }

  public get userId(): string {
    return this._userId.toString();
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
