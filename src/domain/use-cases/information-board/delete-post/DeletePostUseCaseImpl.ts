import { Injectable } from '@nestjs/common';
import { UserNotAdminException } from '../../../common/exceptions/customs/UserNotAdminException';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { InformationBoardRepository } from '../../../repositories/information-board/InformationBoardRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { DeletePostResponse } from '../response.index';
import { DeletePostUseCaseParams } from './dtos/DeletePostUseCaseParams';
import { DeletePostUseCase } from './DeletePostUseCase';
import { InformationBoard } from '../../../entities/InformationBoard';
import { PostNotFoundException } from '../common/exceptions/PostNotFoundException';

@Injectable()
export class DeletePostUseCaseImpl implements DeletePostUseCase {
  public constructor(
    private readonly _informationBoardRepository: InformationBoardRepository,
    private readonly _userRepository: UserRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    userId,
    postId,
  }: DeletePostUseCaseParams): DeletePostResponse {
    this._logger.setContext('DeletePost(Info-Board)');

    const user: User = await this._userRepository.findOne(userId);

    if (!user.isAdmin) {
      throw new UserNotAdminException(
        this._logger.getContext(),
        `비어드민 유저가 정보게시판의 게시글을 삭제 시도.`,
      );
    }

    const Post: InformationBoard =
      await this._informationBoardRepository.findOne(postId);

    if (!Post) {
      throw new PostNotFoundException(
        this._logger.getContext(),
        `미존재 정보게시판 게시글을 삭제 시도.`,
      );
    }

    await this._informationBoardRepository.delete(postId);

    return {};
  }
}
