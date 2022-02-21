import {
  Body,
  Controller,
  Get,
  Injectable,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { DoUseronboardingUseCase } from '../../domain/use-cases/user/do-user-onboarding/DoUserOnboardingUseCase';
import { DoUserOnboardingUseCaseParams } from '../../domain/use-cases/user/do-user-onboarding/dtos/DoUserOnboardingUseCaseParams';
import { FindUserUseCase } from '../../domain/use-cases/user/find-user/FindUserUseCase';
import { ModifyUserUsecaseParams } from '../../domain/use-cases/user/modify-user/dtos/ModifyUserUsecaseParams';
import { ModifyUserUseCase } from '../../domain/use-cases/user/modify-user/ModifyUserUseCase';
import { PatchAvatarUseCaseParams } from '../../domain/use-cases/user/patch-avatar/dtos/PatchAvatarUseCaseParams';
import { PatchAvatarUseCase } from '../../domain/use-cases/user/patch-avatar/PatchAvatarUseCase';
import { MulterFile } from '../../domain/types';
import { FindUserResponseDto } from '../../domain/use-cases/user/find-user/dtos/FindUserResponseDto';
import { FindUserUsecaseParams } from '../../domain/use-cases/user/find-user/dtos/FindUserUsecaseParams';
import {
  DoUserOnboardingResponse,
  FindUserResponse,
  ModifyUserResponse,
  ValidateUsernameResponse,
} from '../../domain/use-cases/user/response.index';
import { User } from '../common/decorators/user.decorator';
import { DoUserOnboardingRequestDto } from './do-user-onboarding/DoUserOnboardingRequestDto';
import { ModifyUserRequestDto } from './modify-user/ModifyUserRequestDto';
import { ValidateUsernameRequestDto } from './validate-username/ValidateUsernameRequestDto';
import { ValidateUsernameUseCaseParams } from '../../domain/use-cases/user/validate-username/dtos/ValidateUsernameUseCaseParams';
import { ValidateUsernameUseCase } from '../../domain/use-cases/user/validate-username/ValidateUsernameUseCase';

@Injectable()
export class UserController {
  constructor(
    private readonly _doUserOnboardingUseCase: DoUseronboardingUseCase,
    private readonly _findUserUseCase: FindUserUseCase,
    private readonly _modifyUserUseCase: ModifyUserUseCase,
    private readonly _patchProfileUseCase: PatchAvatarUseCase,
    private readonly _validateUsernameUseCase: ValidateUsernameUseCase,
  ) { }

  async doUserOnboarding(
    @User() user,
    @Body() doUserOnboardingRequest: DoUserOnboardingRequestDto,
  ): DoUserOnboardingResponse {
    const input: DoUserOnboardingUseCaseParams = {
      id: user.id,
      ...doUserOnboardingRequest,
    };

    const output = await this._doUserOnboardingUseCase.execute(input);

    return output;
  }

  async findUser(@User() user): FindUserResponse {
    const input: FindUserUsecaseParams = {
      id: user.id,
    };

    const {
      age,
      username,
      goal,
      statusMessage,
      avatar: profileImage,
    } = await this._findUserUseCase.execute(input);

    const response: FindUserResponseDto = {
      age,
      username,
      goal,
      statusMessage,
      avatar: profileImage,
    };

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

    await this._modifyUserUseCase.execute(input);
  }

  async patchAvatar(
    @User() user,
    @UploadedFile() avatar?: MulterFile,
  ): ModifyUserResponse {
    const input: PatchAvatarUseCaseParams = {
      id: user.id,
      avatar,
    };

    await this._patchProfileUseCase.execute(input);
  }

  async validateUsername(
    @Body() validateUsernameRequest: ValidateUsernameRequestDto,
  ): ValidateUsernameResponse {
    const input: ValidateUsernameUseCaseParams = {
      ...validateUsernameRequest,
    };

    const output: boolean = await this._validateUsernameUseCase.execute(input);

    return output;
  }
}
