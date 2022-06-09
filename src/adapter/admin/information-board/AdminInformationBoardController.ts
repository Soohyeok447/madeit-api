import { Injectable } from '@nestjs/common';
// import { Request, Response } from 'express';
import { MulterFile } from '../../../domain/common/types';
import { AddPostUseCase } from '../../../domain/use-cases/information-board/add-post/AddPostUseCase';
import { AddPostResponseDto } from '../../../domain/use-cases/information-board/add-post/dtos/AddPostResponseDto';
import { AddPostUseCaseParams } from '../../../domain/use-cases/information-board/add-post/dtos/AddPostUseCaseParams';
import { DeletePostUseCase } from '../../../domain/use-cases/information-board/delete-post/DeletePostUseCase';
import { DeletePostUseCaseParams } from '../../../domain/use-cases/information-board/delete-post/dtos/DeletePostUseCaseParams';
import { ModifyPostResponseDto } from '../../../domain/use-cases/information-board/modify-post/dtos/ModifyPostResponseDto';
import { ModifyPostUseCaseParams } from '../../../domain/use-cases/information-board/modify-post/dtos/ModifyPostUseCaseParams';
import { ModifyPostUseCase } from '../../../domain/use-cases/information-board/modify-post/ModifyPostUseCase';
import { PutCardnewsUseCaseParams } from '../../../domain/use-cases/information-board/put-cardnews/dtos/PutCardnewsUseCaseParams';
import { PutCardnewsUseCase } from '../../../domain/use-cases/information-board/put-cardnews/PutCardnewsUseCase';
import {
  AddPostResponse,
  ModifyPostResponse,
  DeletePostResponse,
  PutCardnewsResponse,
} from '../../../domain/use-cases/information-board/response.index';
import { UserPayload } from '../../common/decorators/user.decorator';
import { AddPostRequestDto } from './add-post/AddPostRequestDto';
import { ModifyPostRequestDto } from './modify-post/ModifyPostRequestDto';
// import { RegisterAdminResponseDto } from '../../domain/use-cases/admin/register-admin/dtos/RegisterAdminResponseDto';
// import { RegisterAdminRequestDto } from './register-admin/RegisterAdminRequestDto';

@Injectable()
export class AdminInformationBoardController {
  public constructor(
    private readonly addPostUseCase: AddPostUseCase,
    private readonly modifyPostUseCase: ModifyPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly putCardnewsUseCase: PutCardnewsUseCase,
  ) {}

  public async addPost(
    user: UserPayload,
    body: AddPostRequestDto,
  ): AddPostResponse {
    const input: AddPostUseCaseParams = {
      userId: user.id,
      title: body.title,
    };

    const response: AddPostResponseDto = await this.addPostUseCase.execute(
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
      await this.modifyPostUseCase.execute(input);

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

    await this.deletePostUseCase.execute(input);

    return {};
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

    await this.putCardnewsUseCase.execute(input);

    return {};
  }
}
