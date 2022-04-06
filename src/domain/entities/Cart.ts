import { ObjectId } from '../common/types';

export class Cart {
  public constructor(
    private _id: ObjectId,
    private _userId: ObjectId,
    private _recommendedRoutineId: ObjectId,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._recommendedRoutineId = _recommendedRoutineId;
  }

  public get id(): string {
    return this._id.toString();
  }

  public get userId(): string {
    return this._userId.toString();
  }

  public get recommendedRoutineId(): string {
    return this._recommendedRoutineId.toString();
  }
}
