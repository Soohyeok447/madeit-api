import { Injectable } from '@nestjs/common';
import { FindUserInput } from 'src/domain/users/use-cases/find-user/dtos/find_user.input';
import { DoUserOnboardingInput } from '../../use-cases/do-user-onboarding/dtos/do_user_onboarding.input';
import { FindUserOutput } from '../../use-cases/find-user/dtos/find_user.output';

@Injectable()
export abstract class UsersService {
  public abstract doUserOnboarding({
    id,
    birth,
    gender,
    job,
    username,
  }: DoUserOnboardingInput): Promise<void>;

  public abstract findUser({ id }: FindUserInput): Promise<FindUserOutput>;
}
