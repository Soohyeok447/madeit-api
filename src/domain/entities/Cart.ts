export class Cart {
  constructor(
    private _id: string,
    private _userId: string,
    private _recommendedRoutineId: string,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._recommendedRoutineId = _recommendedRoutineId;
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get recommendedRoutineId() {
    return this._recommendedRoutineId;
  }
}
