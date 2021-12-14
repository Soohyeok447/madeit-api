import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { hash } from 'src/infrastructure/utils/hash';
import { UserRepository } from 'src/domain/repositories/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/domain/models/user.model';
import { UpdateUserDto } from 'src/domain/repositories/dto/user/update.dto';
import { CreateUserDto } from 'src/domain/repositories/dto/user/create.dto';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  public async create(data: CreateUserDto): Promise<UserModel> {
    const createdUser: User = this.userEntityRepository.create(data);

    const savedUser: User = await this.userEntityRepository.save(createdUser);

    const user: UserModel = {
      refreshToken: savedUser.refresh_token,
      userId: savedUser.user_id,
      ...savedUser,
    }; // Mapping

    return user;
  }

  public async update(id: number, data: UpdateUserDto): Promise<void> {
    await this.userEntityRepository.update(id, data);
  }

  public async delete(id: number): Promise<void> {
    await this.userEntityRepository.delete(id);
  }

  public async findOne(id: number): Promise<UserModel> {
    const result = await this.userEntityRepository.findOne(id);

    if (!result) {
      return undefined;
    }

    const user: UserModel = {
      refreshToken: result.refresh_token,
      userId: result.user_id,
      ...result,
    }; // Mapping

    return user;
  }

  public async findOneByUserId(userId: string): Promise<UserModel> {
    const result = await this.userEntityRepository.findOne({
      where: { userId },
    });

    if (!result) {
      return undefined;
    }

    const user: UserModel = {
      refreshToken: result.refresh_token,
      userId: result.user_id,
      ...result,
    }; // Mapping

    return user;
  }

  public async findOneByEmail(email: string): Promise<UserModel> {
    const result = await this.userEntityRepository.findOne({
      where: { email },
    });

    if (!result) {
      return undefined;
    }

    const user: UserModel = {
      refreshToken: result.refresh_token,
      userId: result.user_id,
      ...result,
    }; // Mapping

    return user;
  }

  public async findOneByUsername(username: string): Promise<UserModel> {
    const result = await this.userEntityRepository.findOne({
      where: { username },
    });

    if (!result) {
      return undefined;
    }

    const user: UserModel = {
      refreshToken: result.refresh_token,
      userId: result.user_id,
      ...result,
    }; // Mapping

    return user;
  }

  public async updateRefreshToken(
    id: number,
    refreshToken: string,
  ): Promise<void> {
    const user = await this.userEntityRepository.findOne(id);

    const hashedRefreshToken = await hash(refreshToken);

    const { refresh_token: _, ...other } = user;

    await this.userEntityRepository.update(id, {
      refresh_token: hashedRefreshToken,
      ...other,
    });
  }
}
