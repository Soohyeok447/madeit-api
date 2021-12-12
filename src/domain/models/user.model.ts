export class UserModel {
  id: number;  

  userId: number;

  email: string;

  username: string;

  provider: string;

  refreshToken?: string;
}
