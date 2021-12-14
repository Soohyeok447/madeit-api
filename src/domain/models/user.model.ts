export class UserModel {
  id: number;

  userId: string;

  email?: string;

  username?: string;

  provider: string;

  refreshToken?: string;
}
