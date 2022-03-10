import { UserModel } from '../../models/UserModel';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';

export abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<UserModel>;

  abstract update(id: string, data: UpdateUserDto): Promise<UserModel>;

  abstract delete(id: string): Promise<void>;

  abstract deleteCompletely(id: string): Promise<void>;

  abstract findAll(): Promise<UserModel[]>;

  abstract findOne(id: string): Promise<UserModel | null>;

  abstract findOneByUserId(userId: string): Promise<UserModel | null>;

  abstract findOneByEmail(email: string): Promise<UserModel | null>;

  abstract findOneByUsername(username: string): Promise<UserModel | null>;

  abstract updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void>;
}
