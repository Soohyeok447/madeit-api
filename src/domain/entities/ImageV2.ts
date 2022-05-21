export class ImageV2 {
  public constructor(
    private _id: string,
    private _uuid: string,
    private _mimetype: string,
    private _createdAt: string,
  ) {
    this._id = _id;
    this._uuid = _uuid;
    this._mimetype = _mimetype;
    this._createdAt = _createdAt;
  }

  public get id(): string {
    return this._id;
  }

  public get uuid(): string {
    return this._uuid;
  }

  public get mimetype(): string {
    return this._mimetype;
  }

  public get createdAt(): string {
    return this._createdAt;
  }
}
