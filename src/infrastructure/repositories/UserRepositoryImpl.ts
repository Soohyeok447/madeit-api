import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { UserRepository } from 'src/domain/repositories/user/UserRepository';
import { UserModel } from 'src/domain/models/UserModel';
import { CreateUserDto } from 'src/domain/repositories/user/dtos/CreateUserDto';
import { UpdateUserDto } from 'src/domain/repositories/user/dtos/UpdateUserDto';
import { HashProviderImpl } from '../providers/HashProviderImpl';
moment.locale('ko');

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserModel>,
  ) { }

  public async create(data: CreateUserDto): Promise<UserModel> {
    const newUser = new this.userModel(data);

    const result = await newUser.save();

    return result;
  }

  public async findOne(id: string): Promise<UserModel | null> {
    const result = await this.userModel
      .findById(id)
      .populate('profile_id')
      .exists('deleted_at', false)
      .lean();

    if (!result) {
      return null;
    }

    return result;
  }

  public async findAll(): Promise<UserModel[] | []> {
    const result = await this.userModel.find().exists('deleted_at', false);

    if (!result) {
      return [];
    }

    return result;
  }

  public async findOneByUserId(userId: string): Promise<UserModel | null> {
    const result = await this.userModel
      .findOne({
        user_id: userId,
      })
      .exists('deleted_at', false)
      .lean();

    if (!result) {
      return null;
    }

    return result;
  }

  public async findOneByEmail(email: string): Promise<UserModel | null> {
    const result = await this.userModel
      .findOne({
        email,
      })
      .exists('deleted_at', false)
      .lean();

    if (!result) {
      return null;
    }

    return result;
  }

  public async findOneByUsername(username: string): Promise<UserModel | null> {
    const result = await this.userModel
      .findOne({
        username,
      })
      .exists('deleted_at', false)
      .lean();

    if (!result) {
      return null;
    }

    return result;
  }

  public async update(id: string, data: UpdateUserDto): Promise<UserModel> {
    const result = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          updated_at: moment().format(),
          ...data,
        },
        { runValidators: true, new: true },
      )
      .exists('deleted_at', false);

    return result;
  }

  public async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(
        id,
        {
          refresh_token: refreshToken ?? await new HashProviderImpl().hash(refreshToken),
          updated_at: moment().format(),
        },
        { runValidators: true },
      )
      .exists('deleted_at', false);
  }

  public async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      deleted_at: moment().format(),
    });
  }
}