import { Repository } from 'typeorm';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { hash } from 'src/infrastructure/utils/hash';
import { UserRepository } from 'src/domain/repositories/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/domain/repositories/dto/user/update.dto';
import { CreateUserDto } from 'src/domain/repositories/dto/user/create.dto';
import { User } from '../entities/user.entity';
import { UserModel } from 'src/domain/models/user.model';
import { Role } from 'src/domain/models/enum/role.enum';


@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,

  ) { }

  public async create(data: CreateUserDto): Promise<UserModel> {    
    const createdUser: User = this.userEntityRepository.create(data);

    const savedUser: User = await this.userEntityRepository.manager.save(createdUser);

    const user: UserModel = {
      refreshToken: savedUser.refresh_token,
      userId: savedUser.user_id,
      isAdmin: savedUser.is_admin,
      ...savedUser,
    }; // Mapping

    return user;
  }

  /**
   * roles가 받아올 때 validate가 안돼서 여기서 validate
   */
  public async update(id: number, data: UpdateUserDto): Promise<void> {
    const keys = Object.keys(Role);

    data.roles.map((role)=>{
      const result = keys.includes(role);

      if(!result) {
        throw new ForbiddenException();
      }
    })
    
    await this.userEntityRepository.update(id, data);
  }

  public async delete(id: number): Promise<void> {
    await this.userEntityRepository.delete(id);
  }

  public async findAll(): Promise<UserModel[]> {
    const users: User[] = await this.userEntityRepository.find({
      select: [
        'id',
        'user_id',
        'email',
        'username',
        'provider',
        'birth',
        'gender',
        'job',
        'roles',
        'is_admin',
        'refresh_token',
      ],
    });

    const mappedResult: UserModel[] = users.map(({ refresh_token, user_id,is_admin ,...other }) => ({
      userId: user_id,
      refreshToken: refresh_token,
      isAdmin: is_admin,
      ...other,
    }));

    return mappedResult;
  }

  public async findOne(id: number): Promise<UserModel> {
    const result = await this.userEntityRepository.findOne(id);

    if (!result) {
      return undefined;
    }

    const user: UserModel = {
      refreshToken: result.refresh_token,
      userId: result.user_id,
      isAdmin: result.is_admin,
      ...result,
    }; // Mapping

    return user;
  }

  public async findOneByUserId(userId: string): Promise<UserModel> {
    const result = await this.userEntityRepository.findOne({
      where: { user_id: userId },
    });

    if (!result) {
      return undefined;
    }

    const user: UserModel = {
      refreshToken: result.refresh_token,
      userId: result.user_id,
      isAdmin: result.is_admin,
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
      isAdmin: result.is_admin,
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
      isAdmin: result.is_admin,
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
