import { Body, Injectable } from '@nestjs/common';
import { UserAuth } from '../common/decorators/user.decorator';
import {
  ValidateCustomDecorators,
  ValidateMongoObjectId,
} from '../common/validators/ValidateMongoObjectId';
import { AddPostUseCase } from '../../domain/use-cases/information-board/add-post/AddPostUseCase';
import { AddPostUseCaseParams } from '../../domain/use-cases/information-board/add-post/dtos/AddPostUseCaseParams';
import { AddPostResponse } from '../../domain/use-cases/information-board/response.index';
import { AddPostRequestDto } from './add-post/AddPostRequestDto';

@Injectable()
export class InformationBoardController {
  constructor(private readonly _addPostUseCase: AddPostUseCase) {}

  async addBoard(
    @UserAuth() user,
    @Body() addPostRequest: AddPostRequestDto,
  ): AddPostResponse {
    const input: AddPostUseCaseParams = {
      userId: user.id,
      title: addPostRequest.title,
    };

    const response = await this._addPostUseCase.execute(input);

    return response;
  }
}
