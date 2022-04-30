import { ObjectId } from '../common/types';

export class CompleteRoutine {
  public constructor(
    private _id: ObjectId,
    private _userId: ObjectId,
    private _routineId: ObjectId,
    private _createdAt: any,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._routineId = _routineId;
    this._createdAt = _createdAt;
  }

  public get id(): string {
    return this._id.toString();
  }

  public get userId(): string {
    return this._userId.toString();
  }

  public get routineId(): string {
    return this._routineId.toString();
  }

  public get createdAt(): any {
    return this._createdAt;
  }
}
