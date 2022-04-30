import { Injectable } from '@nestjs/common';
import { InformationBoard } from '../../../entities/InformationBoard';
import { ImageModel } from '../../../models/ImageModel';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { InformationBoardRepository } from '../../../repositories/information-board/InformationBoardRepository';
import { PostNotFoundException } from '../common/exceptions/PostNotFoundException';
import { GetPostResponse } from '../response.index';
import { GetPostUseCaseParams } from './dtos/GetPostUseCaseParams';
import { GetPostUseCase } from './GetPostUseCase';

@Injectable()
export class GetPostUseCaseImpl implements GetPostUseCase {
  public constructor(
    private readonly _informationBoardRepository: InformationBoardRepository,
    private readonly _imageRepository: ImageRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({ postId }: GetPostUseCaseParams): GetPostResponse {
    this._logger.setContext('GetPost(Info-Board)');

    const Post: InformationBoard =
      await this._informationBoardRepository.findOne(postId);

    if (!Post) {
      throw new PostNotFoundException(
        this._logger.getContext(),
        `미존재 정보게시판 게시글을 읽기 시도.`,
      );
    }

    const updatedPost: InformationBoard =
      await this._informationBoardRepository.modify(postId, {
        views: Post.views + 1,
      });

    const cardnews: ImageModel = Post.cardnews
      ? await this._imageRepository.findOne(Post.cardnews)
      : null;

    return {
      id: updatedPost.id,
      title: updatedPost.title,
      views: updatedPost.views,
      cardnews: cardnews ? cardnews['cloud_keys'] : null,
    };
  }
}
