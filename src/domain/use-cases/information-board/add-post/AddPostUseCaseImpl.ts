import { Injectable } from '@nestjs/common';
import { UserNotAdminException } from '../../../common/exceptions/customs/UserNotAdminException';
import { InformationBoard } from '../../../entities/InformationBoard';
import { User } from '../../../entities/User';
import { InformationBoardRepository } from '../../../repositories/information-board/InformationBoardRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { AddPostResponse } from '../response.index';
import { AddPostUseCase } from './AddPostUseCase';
import { AddPostUseCaseParams } from './dtos/AddPostUseCaseParams';

@Injectable()
export class AddPostUseCaseImpl implements AddPostUseCase {
  constructor(
    private readonly _informationBoardRepository: InformationBoardRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  async execute({ title, userId }: AddPostUseCaseParams): AddPostResponse {
    const user: User = await this._userRepository.findOne(userId);

    if (!user.isAdmin) throw new UserNotAdminException();

    const board: InformationBoard =
      await this._informationBoardRepository.create({
        title,
      });

    return {
      id: board.id,
      title: board.title,
      views: board.views,
    };
  }
}
