import { UserEntity } from '../../entities/User';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';

export abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<UserEntity>;

  abstract update(id: string, data: UpdateUserDto): Promise<UserEntity>;

  abstract delete(id: string): Promise<void>;

  abstract deleteCompletely(id: string): Promise<void>;

  abstract findAll(): Promise<UserEntity[]>;

  abstract findOne(id: string): Promise<UserEntity | null>;

  abstract findOneByUserId(userId: string): Promise<UserEntity | null>;

  abstract findOneByEmail(email: string): Promise<UserEntity | null>;

  abstract findOneByUsername(username: string): Promise<UserEntity | null>;

  abstract updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void>;
}
