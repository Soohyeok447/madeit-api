import { Body, Injectable } from '@nestjs/common';
import { UserAuth, UserPayload } from '../common/decorators/user.decorator';
import { AddPostUseCase } from '../../domain/use-cases/information-board/add-post/AddPostUseCase';
import { AddPostUseCaseParams } from '../../domain/use-cases/information-board/add-post/dtos/AddPostUseCaseParams';
import { AddPostResponse } from '../../domain/use-cases/information-board/response.index';
import { AddPostRequestDto } from './add-post/AddPostRequestDto';
import { AddPostResponseDto } from '../../domain/use-cases/information-board/add-post/dtos/AddPostResponseDto';

@Injectable()
export class InformationBoardController {
  public constructor(private readonly _addPostUseCase: AddPostUseCase) {}

  public async addBoard(
    @UserAuth() user: UserPayload,
    @Body() addPostRequest: AddPostRequestDto,
  ): AddPostResponse {
    const input: AddPostUseCaseParams = {
      userId: user.id,
      title: addPostRequest.title,
    };

    const response: AddPostResponseDto = await this._addPostUseCase.execute(
      input,
    );

    return response;
  }
}
