import { Injectable } from '@nestjs/common';
import { UsersService } from './interface/users.service';
import { UserRepository } from '../users.repository';
import { User } from '../user.model';
import { UpdateUserDto } from '../common/dtos/update.dto';
import { UserNotRegisteredException } from '../use-cases/find-user/exceptions/user_not_registered.exception';
import { FindUserInput } from '../use-cases/find-user/dtos/find_user.input';
import { FindUserOutput } from '../use-cases/find-user/dtos/find_user.output';
import { UsernameConflictException } from '../use-cases/do-user-onboarding/exceptions/username_conflict.exception';
import { InvalidUsernameException } from '../use-cases/do-user-onboarding/exceptions/invalid_username.exception';
import { DoUserOnboardingInput } from '../use-cases/do-user-onboarding/dtos/do_user_onboarding.input';

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
