export class Admin {
  public constructor(
    private _id: string,
    private _identifier: string,
    private _password: string,
  ) {
    this._id = _id;
    this._identifier = _identifier;
    this._password = _password;
  }

  public get id(): string {
    return this._id;
  }

  public get identifier(): string {
    return this._identifier;
  }

  public get password(): string {
    return this._password;
  }
}
