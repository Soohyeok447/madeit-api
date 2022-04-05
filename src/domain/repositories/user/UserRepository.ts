import { User } from '../../entities/User';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';

export abstract class UserRepository {
  public abstract create(data: CreateUserDto): Promise<User>;

  public abstract update(id: string, data: UpdateUserDto): Promise<User>;

  public abstract delete(id: string): Promise<void>;

  public abstract deleteCompletely(id: string): Promise<void>;

  public abstract findAll(): Promise<User[]>;

  public abstract findOne(id: string): Promise<User | null>;

  public abstract findOneByUserId(userId: string): Promise<User | null>;

  public abstract findOneByEmail(email: string): Promise<User | null>;

  public abstract findOneByUsername(username: string): Promise<User | null>;

  public abstract updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void>;
}
