import { User } from '../../entities/User';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';

export abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<User>;

  abstract update(id: string, data: UpdateUserDto): Promise<User>;

  abstract delete(id: string): Promise<void>;

  abstract deleteCompletely(id: string): Promise<void>;

  abstract findAll(): Promise<User[]>;

  abstract findOne(id: string): Promise<User | null>;

  abstract findOneByUserId(userId: string): Promise<User | null>;

  abstract findOneByEmail(email: string): Promise<User | null>;

  abstract findOneByUsername(username: string): Promise<User | null>;

  abstract updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void>;
}
