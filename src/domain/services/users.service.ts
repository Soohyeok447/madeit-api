import { HttpException, Injectable } from '@nestjs/common';
import { UserNotFoundException } from 'src/domain/exceptions/users/user_not_found.exception';
import { DoUserOnboardingInput } from '../dto/user/do_user_onboarding.input';
import { FindUserInput } from '../dto/user/find_user.input';
import { FindUserOutput } from '../dto/user/find_user.output';
import { InvalidUsernameException } from '../exceptions/users/invalid_username.exception';
import { NoCustomerRoleException } from '../exceptions/users/no_customer_role.exception';
import { UsernameConflictException } from '../exceptions/users/username_conflict.exception';
import { UserNotRegisteredException } from '../exceptions/users/user_not_registered.exception';
import { Gender } from '../models/enum/gender.enum';
import { Job } from '../models/enum/job.enum';
import { Role } from '../models/enum/role.enum';
import { User } from '../models/user.model';
import { UpdateUserDto } from '../repositories/dto/user/update.dto';
import { UserRepository } from '../repositories/users.repository';
import { UsersService } from './interfaces/users.service';

@Injectable()
export class UsersServiceImpl extends UsersService {
  constructor(private readonly userRespository: UserRepository) {
    super();
  }

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

    if(username.length<2 || username.length>8){
      throw new InvalidUsernameException();
    }

    const onboardingData:UpdateUserDto = {
      birth,
      gender,
      job,
      username,
    };

    await this.userRespository.update(id, onboardingData);
  }

  public async findUser({ id }: FindUserInput): Promise<FindUserOutput> {
    const user: User = await this.userRespository.findOne(id);

    if (user.gender == Gender.none || user.job == Job.none || !user.username || !user.birth) {
      throw new UserNotRegisteredException();
    }

    console.log(user);

    const output: FindUserOutput = {
      ...user["_doc"],
    };

    console.log(output);
    return output;
  }
}
