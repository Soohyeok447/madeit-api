import { Injectable } from '@nestjs/common';
import { InformationBoard } from '../../../entities/InformationBoard';
import { ImageModel } from '../../../models/ImageModel';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { InformationBoardRepository } from '../../../repositories/information-board/InformationBoardRepository';
import { GetPostsResponse } from '../response.index';
import { GetPostsResponseDto } from './dtos/GetPostsResponseDto';
import { GetPostsUseCaseParams } from './dtos/GetPostsUseCaseParams';
import { GetPostsUseCase } from './GetPostsUseCase';

@Injectable()
export class GetPostsUseCaseImpl implements GetPostsUseCase {
  public constructor(
    private readonly _informationBoardRepository: InformationBoardRepository,
    private readonly _imageRepository: ImageRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    size,
    next,
  }: GetPostsUseCaseParams): GetPostsResponse {
    this._logger.setContext('GetPosts(Info-Board)');

    const Posts: InformationBoard[] =
      await this._informationBoardRepository.findAll(size, next);

    const mappedPosts: GetPostsResponseDto[] = await Promise.all(
      Posts.map(async (e) => {
        const cardnews: ImageModel = e.cardnews
          ? await this._imageRepository.findOne(e.cardnews)
          : null;

        return {
          id: e.id,
          title: e.title,
          views: e.views,
          cardnews: cardnews ? cardnews['cloud_keys'] : null,
        };
      }),
    );

    return mappedPosts;
  }
}
