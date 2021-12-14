import { UserModel } from '../models/user.model';
import { CreateUserDto } from './dto/user/create.dto';
import { UpdateUserDto } from './dto/user/update.dto';

export abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<UserModel>;

  abstract update(id: number, data: UpdateUserDto): Promise<void>;

  abstract delete(id: number): Promise<void>;

  abstract findOne(id: number): Promise<UserModel>;

  abstract findOneByUserId(userId: string): Promise<UserModel>;

  abstract findOneByEmail(email: string): Promise<UserModel>;

  abstract findOneByUsername(username: string): Promise<UserModel>;

  abstract updateRefreshToken(id: number, refreshToken: string): Promise<void>;
}
