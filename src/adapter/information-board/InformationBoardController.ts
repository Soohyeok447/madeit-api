import { Injectable } from '@nestjs/common';
import { UserPayload } from '../common/decorators/user.decorator';
import { AddPostUseCase } from '../../domain/use-cases/information-board/add-post/AddPostUseCase';
import { AddPostUseCaseParams } from '../../domain/use-cases/information-board/add-post/dtos/AddPostUseCaseParams';
import {
  AddPostResponse,
  DeletePostResponse,
  GetPostResponse,
  GetPostsResponse,
  ModifyPostResponse,
  PutCardnewsResponse,
} from '../../domain/use-cases/information-board/response.index';
import { AddPostRequestDto } from './add-post/AddPostRequestDto';
import { AddPostResponseDto } from '../../domain/use-cases/information-board/add-post/dtos/AddPostResponseDto';
import { ModifyPostRequestDto } from './modify-post/ModifyPostRequestDto';
import { ModifyPostUseCaseParams } from '../../domain/use-cases/information-board/modify-post/dtos/ModifyPostUseCaseParams';
import { ModifyPostResponseDto } from '../../domain/use-cases/information-board/modify-post/dtos/ModifyPostResponseDto';
import { ModifyPostUseCase } from '../../domain/use-cases/information-board/modify-post/ModifyPostUseCase';
import { PutCardnewsUseCase } from '../../domain/use-cases/information-board/put-cardnews/PutCardnewsUseCase';
import { DeletePostUseCase } from '../../domain/use-cases/information-board/delete-post/DeletePostUseCase';
import { GetPostsUseCase } from '../../domain/use-cases/information-board/get-posts/GetPostsUseCase';
import { GetPostUseCase } from '../../domain/use-cases/information-board/get-post/GetPostUseCase';
import { DeletePostUseCaseParams } from '../../domain/use-cases/information-board/delete-post/dtos/DeletePostUseCaseParams';
import { GetPostUseCaseParams } from '../../domain/use-cases/information-board/get-post/dtos/GetPostUseCaseParams';
import { GetPostResponseDto } from '../../domain/use-cases/information-board/get-post/dtos/GetPostResponseDto';
import { GetPostsUseCaseParams } from '../../domain/use-cases/information-board/get-posts/dtos/GetPostsUseCaseParams';
import { GetPostsResponseDto } from '../../domain/use-cases/information-board/get-posts/dtos/GetPostsResponseDto';
import { PutCardnewsUseCaseParams } from '../../domain/use-cases/information-board/put-cardnews/dtos/PutCardnewsUseCaseParams';
import { MulterFile } from '../../domain/common/types';

@Injectable()
export class InformationBoardController {
  public constructor(
    private readonly _addPostUseCase: AddPostUseCase,
    private readonly _modifyPostUseCase: ModifyPostUseCase,
    private readonly _getPostUseCase: GetPostUseCase,
    private readonly _getPostsUseCase: GetPostsUseCase,
    private readonly _deletePostUseCase: DeletePostUseCase,
    private readonly _putCardnewsUseCase: PutCardnewsUseCase,
  ) {}

  public async addPost(
    user: UserPayload,
    body: AddPostRequestDto,
  ): AddPostResponse {
    const input: AddPostUseCaseParams = {
      userId: user.id,
      title: body.title,
    };

    const response: AddPostResponseDto = await this._addPostUseCase.execute(
      input,
    );

    return response;
  }

  public async modifyPost(
    user: UserPayload,
    postId: string,
    body: ModifyPostRequestDto,
  ): ModifyPostResponse {
    const input: ModifyPostUseCaseParams = {
      userId: user.id,
      title: body.title,
      postId,
    };

    const response: ModifyPostResponseDto =
      await this._modifyPostUseCase.execute(input);

    return response;
  }

  public async deletePost(
    user: UserPayload,
    postId: string,
  ): DeletePostResponse {
    const input: DeletePostUseCaseParams = {
      userId: user.id,
      postId,
    };

    await this._deletePostUseCase.execute(input);

    return {};
  }

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

  public async putCardnews(
    user: UserPayload,
    postId: string,
    cardnews: MulterFile[],
  ): PutCardnewsResponse {
    const input: PutCardnewsUseCaseParams = {
      userId: user.id,
      postId,
      cardnews,
    };

    await this._putCardnewsUseCase.execute(input);

    return {};
  }
}
