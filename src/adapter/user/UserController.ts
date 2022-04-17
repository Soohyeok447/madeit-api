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
import { UserAuth, UserPayload } from '../common/decorators/user.decorator';
import { ModifyUserRequestDto } from './modify-user/ModifyUserRequestDto';
import { ValidateUsernameRequestDto } from './validate-username/ValidateUsernameRequestDto';
import { ValidateUsernameUseCaseParams } from '../../domain/use-cases/user/validate-username/dtos/ValidateUsernameUseCaseParams';
import { ValidateUsernameUseCase } from '../../domain/use-cases/user/validate-username/ValidateUsernameUseCase';
import { CommonUserResponseDto } from '../../domain/use-cases/user/common/CommonUserResponseDto';
import { ValidateUsernameResponseDto } from '../../domain/use-cases/user/validate-username/dtos/ValidateUsernameResponseDto';

@Injectable()
export class UserController {
  public constructor(
    private readonly _findUserUseCase: FindUserUseCase,
    private readonly _modifyUserUseCase: ModifyUserUseCase,
    private readonly _patchProfileUseCase: PatchAvatarUseCase,
    private readonly _validateUsernameUseCase: ValidateUsernameUseCase,
  ) {}

  public async findUser(@UserAuth() user: UserPayload): FindUserResponse {
    const input: FindUserUsecaseParams = {
      id: user.id,
    };

    const response: FindUserResponseDto = await this._findUserUseCase.execute(
      input,
    );

    return response;
  }

  public async modifyUser(
    @UserAuth() user: UserPayload,
    @Body() modifyUserRequest: ModifyUserRequestDto,
  ): ModifyUserResponse {
    const input: ModifyUserUsecaseParams = {
      id: user.id,
      ...modifyUserRequest,
    };

    const response: CommonUserResponseDto =
      await this._modifyUserUseCase.execute(input);

    return response;
  }

  public async patchAvatar(
    @UserAuth() user: UserPayload,
    @UploadedFile() avatar?: MulterFile,
  ): PatchAvatarResponse {
    const input: PatchAvatarUseCaseParams = {
      id: user.id,
      avatar,
    };

    const response: CommonUserResponseDto =
      await this._patchProfileUseCase.execute(input);

    return response;
  }

  public async validateUsername(
    @Body() validateUsernameRequest: ValidateUsernameRequestDto,
  ): ValidateUsernameResponse {
    const input: ValidateUsernameUseCaseParams = {
      ...validateUsernameRequest,
    };

    const response: ValidateUsernameResponseDto =
      await this._validateUsernameUseCase.execute(input);

    return response;
  }
}
