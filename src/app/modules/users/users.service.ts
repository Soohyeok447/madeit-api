import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dtos/create_user.dto';
import { UserRepository } from './users.repository';
import { EmailConflictException } from '../../common/exceptions/users/email_conflict.exception';
import { UserNotFoundException } from '../../common/exceptions/users/user_not_found.exception';
import { hash } from '../../../app/common/util/util';
import { UsersService } from './interfaces/users.service';

@Injectable()
export class UsersServiceImpl extends UsersService {
  constructor(
    private readonly userRespository: UserRepository,
  ) {
    super();
  }

  public async findOneById(id: number) {
    const result = await this.userRespository.findOne(id);

    if (!result) {
      throw new UserNotFoundException();
    }

    return result;
  }
}