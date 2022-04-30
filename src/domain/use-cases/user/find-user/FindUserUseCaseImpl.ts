import { Injectable } from '@nestjs/common';
import { ImageProvider } from '../../../providers/ImageProvider';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { FindUserResponse } from '../response.index';
import { FindUserUsecaseParams } from './dtos/FindUserUsecaseParams';
import { FindUserUseCase } from './FindUserUseCase';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { CompleteRoutineRepository } from '../../../repositories/complete-routine/CompleteRoutineRepository';
import { CompleteRoutine } from '../../../entities/CompleteRoutine';

@Injectable()
export class FindUserUseCaseImpl implements FindUserUseCase {
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _completeRoutineRepository: CompleteRoutineRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({ id }: FindUserUsecaseParams): FindUserResponse {
    this._logger.setContext('FindUser');

    const user: User = await this._userRepository.findOne(id);

    if (!user) {
      throw new UserNotFoundException(
        this._logger.getContext(),
        `미가입 유저가 find API 호출.`,
      );
    }

    const avatarCDN: string | string[] =
      await this._imageProvider.requestImageToCDN(user.avatarId);

    const completeRoutines: CompleteRoutine[] =
      await this._completeRoutineRepository.findAllByUserId(user.id);

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
