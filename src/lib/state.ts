import type { IState, IUserData } from './types/interfaces';

export class State implements IState {
  private _isAuthenticated: boolean;
  private _user: IUserData | undefined;
  constructor() {
    this._isAuthenticated = false;
    this._user = undefined;
  }

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  get user() {
    return this._user;
  }

  public login(userData: IUserData) {
    this._isAuthenticated = true;
    this._user = userData;
  }

  public logout() {
    this._isAuthenticated = false;
    if (this._user) this._user.isLogined = false;
  }
}
