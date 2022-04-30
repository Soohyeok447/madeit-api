import { ObjectId } from '../common/types';

export class CompleteRoutine {
  public constructor(
    private _id: ObjectId,
    private _userId: ObjectId,
    private _routineId: ObjectId,
    private _createdAt: moment.Moment,
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

  public get createdAt(): moment.Moment {
    return this._createdAt;
  }
}
