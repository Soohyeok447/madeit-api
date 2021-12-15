import { Injectable } from '@nestjs/common';
import { DoUserOnboardingInput } from 'src/domain/dto/user/do_user_onboarding.input';
import { FindUserInput } from 'src/domain/dto/user/find_user.input';
import { FindUserOutput } from 'src/domain/dto/user/find_user.output';

@Injectable()
export abstract class UsersService {
  public abstract doUserOnboarding({ id, birth, gender, job, username }: DoUserOnboardingInput): Promise<void>;

  public abstract findUser({ id }: FindUserInput): Promise<FindUserOutput>;
}
