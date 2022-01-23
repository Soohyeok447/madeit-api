import { Injectable } from '@nestjs/common';
import { hash } from 'src/infrastructure/utils/providers/hash';
import { UserRepository } from 'src/domain/__common__/repositories/user/users.repository';
import { UpdateUserDto } from 'src/domain/__common__/repositories/user/dtos/update.dto';
import { CreateUserDto } from 'src/domain/__common__/repositories/user/dtos/create.dto';
import { User } from 'src/domain/__common__/models/user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
moment.locale('ko');

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}

  public async create(data: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(data);

    const result = await newUser.save();

    return result;
  }

  public async findOne(id: string): Promise<User> {
    const result = await this.userModel
      .findById(id)
      .populate('profile_id')
      .exists('deleted_at', false)
      .lean();

    if (!result) {
      return undefined;
    }

    return result;
  }

  public async findAll(): Promise<User[]> {
    const result = await this.userModel.find().exists('deleted_at', false);

    if (!result) {
      return undefined;
    }

    return result;
  }

  public async findOneByUserId(userId: string): Promise<User> {
    const result = await this.userModel
      .findOne({
        user_id: userId,
      })
      .exists('deleted_at', false)
      .lean();

    if (!result) {
      return undefined;
    }

    return result;
  }

  public async findOneByEmail(email: string): Promise<User> {
    const result = await this.userModel
      .findOne({
        email,
      })
      .exists('deleted_at', false)
      .lean();

    if (!result) {
      return undefined;
    }

    return result;
  }

  public async findOneByUsername(username: string): Promise<User> {
    const result = await this.userModel
      .findOne({
        username,
      })
      .exists('deleted_at', false)
      .lean();

    if (!result) {
      return undefined;
    }

    return result;
  }

  public async update(id: string, data: UpdateUserDto): Promise<User> {
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
    refreshToken: string,
  ): Promise<void> {
    let hashedRefreshToken;

    if (refreshToken) {
      hashedRefreshToken = await hash(refreshToken);

      await this.userModel
        .findByIdAndUpdate(
          id,
          {
            refresh_token: hashedRefreshToken,
            updated_at: moment().format(),
          },
          { runValidators: true },
        )
        .exists('deleted_at', false);
    } else {
      await this.userModel
        .findByIdAndUpdate(
          id,
          {
            refresh_token: null,
            updated_at: moment().format(),
          },
          { runValidators: true },
        )
        .exists('deleted_at', false);
    }
  }

  public async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      deleted_at: moment().format(),
    });
  }
}
