import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create_user.dto';
import { UserRepository } from './users.repository';
import { EmailConflictException } from '../../common/exceptions/users/email_conflict.exception';
import { UserNotFoundException } from '../../common/exceptions/users/user_not_found.exception';
import { hash } from '../../../app/common/util/util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRespository: UserRepository,
  ) { }

  public async create({ username, email, password }: CreateUserDto) {
    try {
      const hashedPassword = await hash(password);

      const userDto = {
        username,
        email,
        password: hashedPassword
      }

      return await this.userRespository.createUser(userDto);
    } catch (err) {
      throw new EmailConflictException(); // err.errno == 1062
    }
  }

  public async findOneById(id: number) {
    const result = await this.userRespository.findOne(id);

    if (!result) {
      throw new UserNotFoundException();
    }

    return result;
  }
}