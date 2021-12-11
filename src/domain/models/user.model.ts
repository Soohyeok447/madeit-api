export class UserModel {
  // userId: number; //TODO userId required

  email: string;

  username: string;

  provider: string;

  refreshToken?: string;
}