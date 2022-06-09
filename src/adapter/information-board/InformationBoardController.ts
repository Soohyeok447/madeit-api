import { Injectable } from '@nestjs/common';
import {
  GetPostResponse,
  GetPostsResponse,
} from '../../domain/use-cases/information-board/response.index';
import { GetPostsUseCase } from '../../domain/use-cases/information-board/get-posts/GetPostsUseCase';
import { GetPostUseCase } from '../../domain/use-cases/information-board/get-post/GetPostUseCase';
import { GetPostUseCaseParams } from '../../domain/use-cases/information-board/get-post/dtos/GetPostUseCaseParams';
import { GetPostResponseDto } from '../../domain/use-cases/information-board/get-post/dtos/GetPostResponseDto';
import { GetPostsUseCaseParams } from '../../domain/use-cases/information-board/get-posts/dtos/GetPostsUseCaseParams';
import { GetPostsResponseDto } from '../../domain/use-cases/information-board/get-posts/dtos/GetPostsResponseDto';

@Injectable()
export class InformationBoardController {
  public constructor(
    private readonly _getPostUseCase: GetPostUseCase,
    private readonly _getPostsUseCase: GetPostsUseCase,
  ) {}

  public async getPost(postId: string): GetPostResponse {
    const input: GetPostUseCaseParams = {
      postId,
    };

    const response: GetPostResponseDto = await this._getPostUseCase.execute(
      input,
    );

    return response;
  }

  public async getPosts(query: any): GetPostsResponse {
    const input: GetPostsUseCaseParams = {
      size: query['size'],
      next: query['next'],
    };

    const response: GetPostsResponseDto[] = await this._getPostsUseCase.execute(
      input,
    );

    return response;
  }
}
