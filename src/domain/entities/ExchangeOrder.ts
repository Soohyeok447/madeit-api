import { ObjectId } from '../common/types';

export class ExchangeOrder {
  public constructor(
    private _id: ObjectId,
    private _userId: ObjectId,
    private _amount: number,
    private _bank: string,
    private _account: string,
    private _state: string,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._amount = _amount;
    this._bank = _bank;
    this._account = _account;
    this._state = '환급 전';
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
}
