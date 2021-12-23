import { User } from '../models/user.model';
import { CreateUserDto } from './dto/user/create.dto';
import { UpdateUserDto } from './dto/user/update.dto';

export abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<User>;

  abstract update(id: string, data: UpdateUserDto): Promise<void>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(): Promise<User[]>;

  abstract findOne(id: string): Promise<User>;

  abstract findOneByUserId(userId: string): Promise<User>;

  abstract findOneByEmail(email: string): Promise<User>;

  abstract findOneByUsername(username: string): Promise<User>;

  abstract updateRefreshToken(id: string, refreshToken: string): Promise<void>;
}
