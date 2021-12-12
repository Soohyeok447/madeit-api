import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { hash } from 'src/infrastructure/utils/hash';
import { UserRepository } from 'src/domain/repositories/database/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/domain/models/user.model';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  public async findOne(id: number): Promise<UserModel> {
    const result = await this.userEntityRepository.findOne(id);

    if (!result) {
      return undefined;
    }

    const user: UserModel = { ...result };

    return user;
  }

  public async findOneByUserId(userId: string): Promise<UserModel> {
    const result = await this.userEntityRepository.findOne({
      where: { userId },
    });

    if (!result) {
      return undefined;
    }

    const user: UserModel = { ...result };

    return user;
  }

  public async findOneByEmail(email: string): Promise<UserModel> {
    const result = await this.userEntityRepository.findOne({
      where: { email },
    });

    if (!result) {
      return undefined;
    }

    let user: UserModel;

    user = { ...result };

    return user;
  }

  public async findOneByUsername(username: string): Promise<UserModel> {
    const result = await this.userEntityRepository.findOne({
      where: { username },
    });

    if (!result) {
      return undefined;
    }

    let user: UserModel;

    user = { ...result };

    return user;
  }

  public async updateRefreshToken(id: number, refreshToken: string) {
    const user = await this.userEntityRepository.findOne(id);

    const hashedRefreshToken = await hash(refreshToken);

    const { refreshToken: _, ...other } = user;

    return this.userEntityRepository.update(id, {
      refreshToken: hashedRefreshToken,
      ...other,
    });
  }
}
