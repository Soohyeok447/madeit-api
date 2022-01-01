import { Injectable } from '@nestjs/common';
import { DoUserOnboardingInput } from '../dto/user/do_user_onboarding.input';
import { FindUserInput } from '../dto/user/find_user.input';
import { FindUserOutput } from '../dto/user/find_user.output';
import { InvalidUsernameException } from '../exceptions/users/invalid_username.exception';
import { UsernameConflictException } from '../exceptions/users/username_conflict.exception';
import { UserNotRegisteredException } from '../exceptions/users/user_not_registered.exception';
import { User } from '../models/user.model';
import { UpdateUserDto } from '../repositories/dto/user/update.dto';
import { UserRepository } from '../repositories/users.repository';
import { UsersService } from './interfaces/users.service';

@Injectable()
export class UsersServiceImpl implements UsersService {
  constructor(private readonly userRespository: UserRepository) {}

  public async doUserOnboarding({
    id,
    birth,
    gender,
    job,
    username,
  }: DoUserOnboardingInput): Promise<void> {
    const assertResult = await this.userRespository.findOneByUsername(username);

    if (assertResult) {
      throw new UsernameConflictException();
    }

    if (username.length < 2 || username.length > 8) {
      throw new InvalidUsernameException();
    }

    const onboardingData: UpdateUserDto = {
      birth,
      gender,
      job,
      username,
    };

    await this.userRespository.update(id, onboardingData);
  }

  public async findUser({ id }: FindUserInput): Promise<FindUserOutput> {
    const user: User = await this.userRespository.findOne(id);

    if (!user.gender || !user.job || !user.username || !user.birth) {
      throw new UserNotRegisteredException();
    }

    const output: FindUserOutput = {
      ...user,
    };

    return output;
  }
}
