import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from 'src/domain/exceptions/users/user_not_found.exception';
import { DoUserOnboardingInput } from '../dto/user/do_user_onboarding.input';
import { UsernameConflictException } from '../exceptions/users/username_conflict.exception';
import { UserNotRegisteredException } from '../exceptions/users/user_not_registered.exception';
import { UserRepository } from '../repositories/users.repository';
import { UsersService } from './interfaces/users.service';

@Injectable()
export class UsersServiceImpl extends UsersService {
  constructor(private readonly userRespository: UserRepository) {
    super();
  }

  public async doUserOnboarding({ id, birth, gender, job, username }: DoUserOnboardingInput): Promise<void> {
    const usernames = await this.userRespository.findAllUsername();

    const assertResult = usernames.find(e => e == username);

    if(assertResult){
      throw new UsernameConflictException();
    }

    const onboardingData = {
      birth,
      gender,
      job,
      username,
    }

    await this.userRespository.update(id, onboardingData);
  }
}

