import { UserModel } from '../../models/UserModel';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';

export abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<UserModel>;

  abstract update(id: string, data: UpdateUserDto): Promise<UserModel>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(): Promise<UserModel[]>;

  abstract findOne(id: string): Promise<UserModel>;

  abstract findOneByUserId(userId: string): Promise<UserModel>;

  abstract findOneByEmail(email: string): Promise<UserModel>;

  abstract findOneByUsername(username: string): Promise<UserModel>;

  abstract updateRefreshToken(id: string, refreshToken: string): Promise<void>;
}
