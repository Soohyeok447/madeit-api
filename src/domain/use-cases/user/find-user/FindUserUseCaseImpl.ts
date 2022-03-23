import { Injectable } from '@nestjs/common';
import { ImageProvider } from '../../../providers/ImageProvider';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { FindUserResponse } from '../response.index';
import { FindUserUsecaseParams } from './dtos/FindUserUsecaseParams';
import { UserNotRegisteredException } from './exceptions/UserNotRegisteredException';
import { FindUserUseCase } from './FindUserUseCase';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { ImageRepository } from '../../../repositories/image/ImageRepository';

@Injectable()
export class FindUserUseCaseImpl implements FindUserUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
  ) {}

  public async execute({ id }: FindUserUsecaseParams): FindUserResponse {
    const user = await this._userRepository.findOne(id);

    if (!user) throw new UserNotFoundException();

    if (!user.age || !user.username) throw new UserNotRegisteredException();

    const avatar = await this._imageRepository.findOne(user.avatar);

    const avatarCDN = await this._imageProvider.requestImageToCDN(avatar);

    return {
      username: user.username,
      age: user.age,
      goal: user.goal,
      statusMessage: user.statusMessage,
      avatar: avatarCDN as string,
      point: user.point,
      exp: user.exp,
      didRoutinesInTotal: user.didRoutinesInTotal,
      didRoutinesInMonth: user.didRoutinesInMonth,
      level: user.level,
    };
  }
}
