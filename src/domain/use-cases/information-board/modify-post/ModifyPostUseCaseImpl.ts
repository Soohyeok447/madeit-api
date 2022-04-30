import { Injectable } from '@nestjs/common';
import { UserNotAdminException } from '../../../common/exceptions/customs/UserNotAdminException';
import { InformationBoard } from '../../../entities/InformationBoard';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { InformationBoardRepository } from '../../../repositories/information-board/InformationBoardRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { PostNotFoundException } from '../common/exceptions/PostNotFoundException';
import { ModifyPostResponse } from '../response.index';
import { ModifyPostUseCaseParams } from './dtos/ModifyPostUseCaseParams';
import { ModifyPostUseCase } from './ModifyPostUseCase';

@Injectable()
export class ModifyPostUseCaseImpl implements ModifyPostUseCase {
  public constructor(
    private readonly _informationBoardRepository: InformationBoardRepository,
    private readonly _userRepository: UserRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    title,
    postId,
    userId,
  }: ModifyPostUseCaseParams): ModifyPostResponse {
    this._logger.setContext('ModifyPost(Info-Board)');

    const user: User = await this._userRepository.findOne(userId);

    if (!user.isAdmin) {
      throw new UserNotAdminException(
        this._logger.getContext(),
        `비어드민 유저가 정보게시판의 게시글을 수정 시도.`,
      );
    }

    const existingPost: InformationBoard =
      await this._informationBoardRepository.findOne(postId);

    if (!existingPost) {
      throw new PostNotFoundException(
        this._logger.getContext(),
        `미존재 정보게시판 게시글을 수정 시도.`,
      );
    }

    const Post: InformationBoard =
      await this._informationBoardRepository.modify(postId, { title });

    return {
      id: Post.id,
      title: Post.title,
      views: Post.views,
    };
  }
}
