import { Injectable } from '@nestjs/common';
import { UserNotAdminException } from '../../../common/exceptions/customs/UserNotAdminException';
import { InformationBoard } from '../../../entities/InformationBoard';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { InformationBoardRepository } from '../../../repositories/information-board/InformationBoardRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { AddPostResponse } from '../response.index';
import { AddPostUseCase } from './AddPostUseCase';
import { AddPostUseCaseParams } from './dtos/AddPostUseCaseParams';

@Injectable()
export class AddPostUseCaseImpl implements AddPostUseCase {
  public constructor(
    private readonly _informationBoardRepository: InformationBoardRepository,
    private readonly _userRepository: UserRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    title,
    userId,
  }: AddPostUseCaseParams): AddPostResponse {
    this._logger.setContext('AddPost(Info-Board)');

    const user: User = await this._userRepository.findOne(userId);

    if (!user.isAdmin) {
      throw new UserNotAdminException(
        this._logger.getContext(),
        `비어드민 유저가 정보게시판에 게시글을 추가 시도.`,
      );
    }

    const Post: InformationBoard =
      await this._informationBoardRepository.create({
        title,
      });

    return {
      id: Post.id,
      title: Post.title,
      views: Post.views,
    };
  }
}
