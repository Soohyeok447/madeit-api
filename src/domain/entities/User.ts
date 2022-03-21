import { Injectable } from '@nestjs/common';
import { LevelDictionary } from '../common/dictionaries/LevelDictionary';
import { Level } from '../common/enums/Level';
import { Provider } from '../use-cases/auth/common/types/provider';

@Injectable()
export class User {
  constructor(
    private _id: string,
    private _userId: string,
    private _email: string,
    private _username: string,
    private _age: number,
    private _goal: string,
    private _statusMessage: string,
    private _provider: Provider,
    private _refreshToken: string,
    private _isAdmin: boolean,
    private _avatar: string,
    private _exp: number,
    private _point: number,
    private _didRoutinesInTotal: number,
    private _didRoutinesInMonth: number,
    private _level: Level,
  ) {
    this._id;
    this._userId;
    this._email;
    this._username;
    this._age;
    this._goal;
    this._statusMessage;
    this._provider;
    this._refreshToken;
    this._isAdmin;
    this._avatar;
    this._exp;
    this._point;
    this._didRoutinesInTotal;
    this._didRoutinesInMonth;
    this._level;
  }

  get id() {
    return this._id;
  }

  get username() {
    return this._username;
  }

  get age() {
    return this._age;
  }

  get goal() {
    return this._goal;
  }

  get statusMessage() {
    return this._statusMessage;
  }

  get point() {
    return this._point;
  }

  get exp() {
    return this._exp;
  }

  get didRoutinesInTotal() {
    return this._didRoutinesInTotal;
  }

  get didRoutinesInMonth() {
    return this._didRoutinesInMonth;
  }

  get level() {
    return this._level;
  }

  public setLevel(exp: number) {
    if (exp < 300) this._level = LevelDictionary[0];
    else if (300 <= exp && exp < 600) this._level = LevelDictionary[1];
    else if (600 <= exp && exp < 1000) this._level = LevelDictionary[2];
    else if (1000 <= exp && exp < 1300) this._level = LevelDictionary[3];
    else if (1300 <= exp && exp < 1600) this._level = LevelDictionary[4];
    else if (1600 <= exp && exp < 2000) this._level = LevelDictionary[5];
    else if (2000 <= exp && exp < 2300) this._level = LevelDictionary[6];
    else this._level = LevelDictionary[7];
  }

  get refreshToken() {
    return this._refreshToken;
  }

  get isAdmin() {
    if (!this._isAdmin) return false;
    return true;
  }

  get avatar() {
    return this._avatar;
  }

  public exists(): boolean {
    if (!this.id) return false;
    return true;
  }
}
