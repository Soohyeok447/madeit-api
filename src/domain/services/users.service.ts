import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from 'src/domain/exceptions/users/user_not_found.exception';
import { DoUserOnboardingInput } from '../dto/user/do_user_onboarding.input';
import { UserNotRegisteredException } from '../exceptions/users/user_not_registered.exception';
import { UserRepository } from '../repositories/users.repository';
import { UsersService } from './interfaces/users.service';

@Injectable()
export class UsersServiceImpl extends UsersService {
  constructor(private readonly userRespository: UserRepository) {
    super();
  }

  public async doUserOnboarding({ id, birth, gender, job, username }: DoUserOnboardingInput): Promise<void> {
    const user = await this.userRespository.findOne(id);

    if(!user.birth || !user.gender || !user.job || !user.username){
      throw new UserNotRegisteredException();
    }

    const onboardingData = {
      birth,
      gender,
      job,
      username,
      ...user
    }

    await this.userRespository.update(id, onboardingData);
  }
}
