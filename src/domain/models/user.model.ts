export class UserModel {
  // userId: number; //TODO userId required
  id: number;

  email: string;

  username: string;

  provider: string;

  refreshToken?: string;
}