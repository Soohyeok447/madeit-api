import { UserModel } from "../../models/user.model";

export abstract class UserRepository {
  abstract findOne(id: number): Promise<UserModel>;
  
  abstract findOneByUserId(userId: number): Promise<UserModel>;

  abstract findOneByEmail(email: string): Promise<UserModel>;

  abstract findOneByUsername(username: string): Promise<UserModel>;

  abstract updateRefreshToken(id: number, refreshToken: string);
}