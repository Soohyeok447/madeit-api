import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create_user.dto';
import { UserRepository } from './users.repository';
import { EmailConflictException } from '../../common/exceptions/users/email_conflict.exception';
import { UserNotFoundException } from '../../common/exceptions/users/user_not_found.exception';
import { hash } from '../../../app/common/util/util';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRespository: UserRepository,
  ) { }

  public async create({ username, email, password }: CreateUserDto) {
      const hashedPassword = await hash(password);

      const userDto = {
        username,
        email,
        password: hashedPassword
      }

      const result = await this.userRespository.createUser(userDto);

      return result;
  }

  public async findOneById(id: number) {
      const result = await this.userRespository.findOne(id);

      if (!result) {
        throw new UserNotFoundException();
      }

      return result;
  }
}