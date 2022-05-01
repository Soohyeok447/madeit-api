import { LevelDictionary } from '../common/dictionaries/LevelDictionary';
import { Level } from '../common/enums/Level';
import { ObjectId } from '../common/types';
import { Provider } from '../use-cases/auth/common/types/provider';

export class User {
  public constructor(
    private _id: ObjectId,
    private _userId: string,
    private _email: string,
    private _username: string,
    private _age: number,
    private _goal: string,
    private _statusMessage: string,
    private _provider: Provider,
    private _refreshToken: string,
    private _isAdmin: boolean,
    private _avatarId: ObjectId,
    private _exp: number,
    private _point: number,
    private _level: Level,
    private _createdAt: string,
    private _updatedAt: string,
    private _deletedAt: string,
  ) {
    this._id = _id;
    this._userId = _userId;
    this._email = _email;
    this._username = _username;
    this._age = _age;
    this._goal = _goal;
    this._statusMessage = _statusMessage;
    this._provider = _provider;
    this._refreshToken = _refreshToken;
    this._isAdmin = _isAdmin;
    this._avatarId = _avatarId;
    this._exp = _exp;
    this._point = _point;
    this._level = _level;
    this._createdAt = _createdAt;
    this._updatedAt = _updatedAt;
    this._deletedAt = _deletedAt;
  }

  public get id(): string {
    return this._id.toString();
  }

  public get username(): string {
    return this._username;
  }

  public get age(): number {
    return this._age;
  }

  public get goal(): string {
    return this._goal;
  }

  public get statusMessage(): string {
    return this._statusMessage;
  }

  public get point(): number {
    return this._point;
  }

  public get exp(): number {
    return this._exp;
  }

  public get level(): Level {
    return this._level;
  }

  public setLevel(exp: number): void {
    if (exp < 300) this._level = LevelDictionary[0];
    else if (300 <= exp && exp < 600) this._level = LevelDictionary[1];
    else if (600 <= exp && exp < 1000) this._level = LevelDictionary[2];
    else if (1000 <= exp && exp < 1300) this._level = LevelDictionary[3];
    else if (1300 <= exp && exp < 1600) this._level = LevelDictionary[4];
    else if (1600 <= exp && exp < 2000) this._level = LevelDictionary[5];
    else if (2000 <= exp && exp < 2300) this._level = LevelDictionary[6];
    else this._level = LevelDictionary[7];
  }

  public get refreshToken(): string {
    return this._refreshToken;
  }

  public get isAdmin(): boolean {
    return this._isAdmin;
  }

  public get avatarId(): string {
    return this._avatarId.toString();
  }

  public exists(): boolean {
    if (!this.id) return false;
    return true;
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
