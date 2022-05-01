import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
moment.locale('ko');
import { UserRepository } from '../../domain/repositories/user/UserRepository';
import { CreateUserDto } from '../../domain/repositories/user/dtos/CreateUserDto';
import { UpdateUserDto } from '../../domain/repositories/user/dtos/UpdateUserDto';
import { HashProviderImpl } from '../providers/HashProviderImpl';
import { InfrastructureError } from '../../domain/common/exceptions/customs/InfrastructureError';
import { UserSchemaModel } from '../schemas/models/UserSchemaModel';
import { UserMapper } from './mappers/UserMapper';
import { User } from '../../domain/entities/User';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  public constructor(
    @InjectModel('User')
    private readonly userMongoModel: Model<UserSchemaModel>,
  ) {}

  public async create(dto: CreateUserDto): Promise<User> {
    const mappedDto: UserSchemaModel = UserMapper.mapCreateDtoToSchema(dto);

    const newUser: any = new this.userMongoModel(mappedDto);

    const userSchemaModel: any = await newUser.save();

    return UserMapper.mapSchemaToEntity(userSchemaModel);
  }

  public async findOne(id: string): Promise<User | null> {
    const userSchemaModel: UserSchemaModel = await this.userMongoModel
      .findById(id)
      // .populate('avatar_id')
      .exists('deleted_at', false)
      .lean();

    if (!userSchemaModel) {
      return null;
    }

    return UserMapper.mapSchemaToEntity(userSchemaModel);
  }

  public async findAll(): Promise<User[]> {
    const userSchemaModels: UserSchemaModel[] = await this.userMongoModel
      .find()
      .exists('deleted_at', false)
      .lean();

    if (!userSchemaModels) {
      return [];
    }

    const userEntity: User[] = userSchemaModels.map((userSchemaModel) => {
      return UserMapper.mapSchemaToEntity(userSchemaModel);
    });

    return userEntity;
  }

  public async findOneByUserId(userId: string): Promise<User | null> {
    const userSchemaModel: UserSchemaModel = await this.userMongoModel
      .findOne({
        user_id: userId,
      })
      // .exists('deleted_at', false)
      .lean();

    if (!userSchemaModel) {
      return null;
    }

    return UserMapper.mapSchemaToEntity(userSchemaModel);
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    const userSchemaModel: UserSchemaModel = await this.userMongoModel
      .findOne({
        email,
      })
      .exists('deleted_at', false)
      .lean();

    if (!userSchemaModel) {
      return null;
    }

    return UserMapper.mapSchemaToEntity(userSchemaModel);
  }

  public async findOneByUsername(username: string): Promise<User | null> {
    const userSchemaModel: UserSchemaModel = await this.userMongoModel
      .findOne({
        username,
      })
      .exists('deleted_at', false)
      .lean();

    if (!userSchemaModel) {
      return null;
    }

    return UserMapper.mapSchemaToEntity(userSchemaModel);
  }

  public async update(id: string, dto: UpdateUserDto): Promise<User> {
    const mappedDto: UserSchemaModel = UserMapper.mapUpdateDtoToSchema(dto);

    const userSchemaModel: UserSchemaModel = await this.userMongoModel
      .findByIdAndUpdate(
        id,
        {
          updated_at: moment().format(),
          ...mappedDto,
        },
        { runValidators: true, new: true },
      )
      // .populate('avatar_id')
      .exists('deleted_at', false)
      .lean();

    return UserMapper.mapSchemaToEntity(userSchemaModel);
  }

  public async updateIncludedDeletedAt(
    id: string,
    data: UpdateUserDto,
  ): Promise<User> {
    const mappedData: UserSchemaModel = UserMapper.mapUpdateDtoToSchema(data);

    const userSchemaModel: UserSchemaModel = await this.userMongoModel
      .findByIdAndUpdate(
        id,
        {
          updated_at: moment().format(),
          ...mappedData,
        },
        { runValidators: true, new: true },
      )
      .lean();

    return UserMapper.mapSchemaToEntity(userSchemaModel);
  }

  public async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    try {
      await this.userMongoModel
        .findByIdAndUpdate(
          id,
          {
            refresh_token: refreshToken
              ? await new HashProviderImpl().hash(refreshToken)
              : null,
            updated_at: moment().format(),
          },
          { runValidators: true },
        )
        .exists('deleted_at', false);
    } catch (err) {
      console.log(err);
      throw new InfrastructureError();
    }
  }

  public async delete(id: string): Promise<void> {
    await this.userMongoModel.findByIdAndUpdate(id, {
      deleted_at: moment().format(),
    });
  }

  public async deleteCompletely(userId: string): Promise<void> {
    await this.userMongoModel.deleteOne({ user_id: userId });
  }
}
