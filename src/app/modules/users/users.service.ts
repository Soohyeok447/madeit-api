import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create_user.dto';
import { UserRepository } from './users.repository';
import { EmailConflictException } from '../../../app/common/exceptions/email_conflict.exception';
import { UserNotFoundException } from '../../../app/common/exceptions/user_not_found.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRespository: UserRepository,
  ) { }

  public async create(createUserDto: CreateUserDto) {
    try {
      const { username, email, password } = createUserDto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

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