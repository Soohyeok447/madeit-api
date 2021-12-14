import { UserModel } from '../../models/user.model';
import { CreateDto } from './dto/create.dto';
import { SaveDto } from './dto/save.dto';
import { UpdateDto } from './dto/update.dto';

export abstract class UserRepository {
  abstract create(data: CreateDto): Promise<UserModel>;
  
  abstract update(id: number, data: UpdateDto): Promise<void>;

  abstract delete(id: number): Promise<void>;

  abstract findOne(id: number): Promise<UserModel>;

  abstract findOneByUserId(userId: string): Promise<UserModel>;

  abstract findOneByEmail(email: string): Promise<UserModel>;

  abstract findOneByUsername(username: string): Promise<UserModel>;
  
  abstract updateRefreshToken(id: number, refreshToken: string): Promise<void>;
  
}
