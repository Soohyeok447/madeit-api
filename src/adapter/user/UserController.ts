import { Body, Injectable, UploadedFile } from '@nestjs/common';
import { FindUserUseCase } from '../../domain/use-cases/user/find-user/FindUserUseCase';
import { ModifyUserUsecaseParams } from '../../domain/use-cases/user/modify-user/dtos/ModifyUserUsecaseParams';
import { ModifyUserUseCase } from '../../domain/use-cases/user/modify-user/ModifyUserUseCase';
import { PatchAvatarUseCaseParams } from '../../domain/use-cases/user/patch-avatar/dtos/PatchAvatarUseCaseParams';
import { PatchAvatarUseCase } from '../../domain/use-cases/user/patch-avatar/PatchAvatarUseCase';
import { MulterFile } from '../../domain/common/types';
import { FindUserResponseDto } from '../../domain/use-cases/user/find-user/dtos/FindUserResponseDto';
import { FindUserUsecaseParams } from '../../domain/use-cases/user/find-user/dtos/FindUserUsecaseParams';
import {
  FindUserResponse,
  ModifyUserResponse,
  PatchAvatarResponse,
  ValidateUsernameResponse,
} from '../../domain/use-cases/user/response.index';
import { User } from '../common/decorators/user.decorator';
import { ModifyUserRequestDto } from './modify-user/ModifyUserRequestDto';
import { ValidateUsernameRequestDto } from './validate-username/ValidateUsernameRequestDto';
import { ValidateUsernameUseCaseParams } from '../../domain/use-cases/user/validate-username/dtos/ValidateUsernameUseCaseParams';
import { ValidateUsernameUseCase } from '../../domain/use-cases/user/validate-username/ValidateUsernameUseCase';

@Injectable()
export class UserController {
  constructor(
    private readonly _findUserUseCase: FindUserUseCase,
    private readonly _modifyUserUseCase: ModifyUserUseCase,
    private readonly _patchProfileUseCase: PatchAvatarUseCase,
    private readonly _validateUsernameUseCase: ValidateUsernameUseCase,
  ) {}

  async findUser(@User() user): FindUserResponse {
    const input: FindUserUsecaseParams = {
      id: user.id,
    };

    const response: FindUserResponseDto = await this._findUserUseCase.execute(
      input,
    );

    return response;
  }

  async modifyUser(
    @User() user,
    @Body() modifyUserRequest: ModifyUserRequestDto,
  ): ModifyUserResponse {
    const input: ModifyUserUsecaseParams = {
      id: user.id,
      ...modifyUserRequest,
    };

    const response = await this._modifyUserUseCase.execute(input);

    return response;
  }

  async patchAvatar(
    @User() user,
    @UploadedFile() avatar?: MulterFile,
  ): PatchAvatarResponse {
    const input: PatchAvatarUseCaseParams = {
      id: user.id,
      avatar,
    };

    const response = await this._patchProfileUseCase.execute(input);

    return response;
  }

  async validateUsername(
    @Body() validateUsernameRequest: ValidateUsernameRequestDto,
  ): ValidateUsernameResponse {
    const input: ValidateUsernameUseCaseParams = {
      ...validateUsernameRequest,
    };

    const response = await this._validateUsernameUseCase.execute(input);

    return response;
  }
}
