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

    await this.checkConflictionUsingEmail(email);

    const userDto = {
      username,
      email,
      password: hashedPassword
    }

    return this.createUser(userDto);
  }

  private async checkConflictionUsingEmail(email: string) {
    const user = await this.userRespository.findOneByEmail(email);

    if (user !== null) {
      throw new EmailConflictException();
    }
  }

  public async findOneById(id: number) {
    const result = await this.userRespository.findOne(id);

    if (!result) {
      throw new UserNotFoundException();
    }

    return result;
  }

  private async createUser({ email, password, username }: CreateUserDto) {
    const user = this.userRespository.create({ email, password, username });
    
    return this.userRespository.save(user);
  }
}