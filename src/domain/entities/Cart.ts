import { ObjectId } from '../common/types';

export class Cart {
  public constructor(
    private _id: ObjectId,
    private _userId: ObjectId,
    private _recommendedRoutineId: ObjectId,
    private _createdAt: string,
    private _updatedAt: string,
    private _deletedAt: string,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._recommendedRoutineId = _recommendedRoutineId;
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

  public get recommendedRoutineId(): string {
    return this._recommendedRoutineId.toString();
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
