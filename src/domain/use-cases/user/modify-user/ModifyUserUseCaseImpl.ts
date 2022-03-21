import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ModifyUserUsecaseParams } from './dtos/ModifyUserUsecaseParams';
import { ModifyUserResponse } from '../response.index';
import { ModifyUserUseCase } from './ModifyUserUseCase';
import { UserUtils } from '../common/UserUtils';
import { ImageProvider } from '../../../providers/ImageProvider';
import { UsernameConflictException } from '../validate-username/exceptions/UsernameConflictException';
import { InvalidUsernameException } from '../validate-username/exceptions/InvalidUsernameException';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';

@Injectable()
export class ModifyUserUseCaseImpl implements ModifyUserUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
  ) {}

  public async execute({
    id,
    username,
    age,
    statusMessage,
    goal,
  }: ModifyUserUsecaseParams): ModifyUserResponse {
    const existingUser = await this._userRepository.findOne(id);

    if (!existingUser) throw new UserNotFoundException();

    if (existingUser.username !== username) {
      const existingUsername = await this._userRepository.findOneByUsername(
        username,
      );

      if (existingUsername) throw new UsernameConflictException();

      const isValid: boolean = UserUtils.validateUsername(username);

      if (!isValid) throw new InvalidUsernameException();
    }

    const modifiedUser: User = await this._userRepository.update(id, {
      age,
      goal,
      statusMessage,
      username,
    });

    const avatarUrl = await this._imageProvider.requestImageToCDN(
      modifiedUser.avatar,
    );

    return {
      username: modifiedUser.username,
      age: modifiedUser.age,
      goal: modifiedUser.goal,
      statusMessage: modifiedUser.statusMessage,
      avatar: avatarUrl,
      point: modifiedUser.point,
      exp: modifiedUser.exp,
      didRoutinesInTotal: modifiedUser.didRoutinesInTotal,
      didRoutinesInMonth: modifiedUser.didRoutinesInMonth,
      level: modifiedUser.level,
    };
  }
}
