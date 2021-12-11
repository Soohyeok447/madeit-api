import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/adapter/services/users.service';
import { UserNotFoundException } from 'src/domain/exceptions/users/user_not_found.exception';
import { UserRepository } from '../repositories/database/users.repository';

@Injectable()
export class UsersServiceImpl extends UsersService {
  constructor(private readonly userRespository: UserRepository) {
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
