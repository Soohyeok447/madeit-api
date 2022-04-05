export class Cart {
  public constructor(
    private _id: string,
    private _userId: string,
    private _recommendedRoutineId: string,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._recommendedRoutineId = _recommendedRoutineId;
  }

  public get id(): string {
    return this._id;
  }

  public get userId(): string {
    return this._userId;
  }

  public get recommendedRoutineId(): string {
    return this._recommendedRoutineId;
  }
}
