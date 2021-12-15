import { Injectable } from '@nestjs/common';
import { DoUserOnboardingInput } from 'src/domain/dto/user/do_user_onboarding.input';

@Injectable()
export abstract class UsersService {
  public abstract doUserOnboarding({ id, birth, gender, job, username }: DoUserOnboardingInput): Promise<void>;

  public abstract find({ id }: FindUserInput): Promise<FindUserOutput>;
}
