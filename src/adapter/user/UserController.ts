import {
  Body,
  Controller,
  Get,
  Injectable,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { Resolution } from 'src/domain/enums/Resolution';
import { DoUseronboardingUseCase } from 'src/domain/use-cases/user/do-user-onboarding/DoUserOnboardingUseCase';
import { DoUserOnboardingUseCaseParams } from 'src/domain/use-cases/user/do-user-onboarding/dtos/DoUserOnboardingUseCaseParams';
import { FindUserUseCase } from 'src/domain/use-cases/user/find-user/FindUserUseCase';
import { ModifyUserUsecaseParams } from 'src/domain/use-cases/user/modify-user/dtos/ModifyUserUsecaseParams';
import { ModifyUserUseCase } from 'src/domain/use-cases/user/modify-user/ModifyUserUseCase';
import { MulterFile } from '../../domain/types';
import { FindUserResponseDto } from '../../domain/use-cases/user/find-user/dtos/FindUserResponseDto';
import { FindUserUsecaseParams } from '../../domain/use-cases/user/find-user/dtos/FindUserUsecaseParams';
import {
  DoUserOnboardingResponse,
  FindUserResponse,
  ModifyUserResponse,
} from '../../domain/use-cases/user/response.index';
import { User } from '../common/decorators/user.decorator';
import { DoUserOnboardingRequestDto } from './do-user-onboarding/DoUserOnboardingRequestDto';
import { ModifyUserRequestDto } from './modify-user/ModifyUserRequestDto';

@Injectable()
export class UserController {
  constructor(
    private readonly _doUserOnboardingUseCase: DoUseronboardingUseCase,
    private readonly _findUserUseCase: FindUserUseCase,
    private readonly _modifyUserUseCase: ModifyUserUseCase,
  ) { }

  async doUserOnboarding(
    @User() user,
    @Body() doUserOnboardingRequest: DoUserOnboardingRequestDto,
  ): DoUserOnboardingResponse {
    const input: DoUserOnboardingUseCaseParams = {
      id: user.id,
      ...doUserOnboardingRequest,
    };

    await this._doUserOnboardingUseCase.execute(input);
  }

  async findUser(
    @User() user,
    @Query('resolution') resolution: Resolution, //TODO 뺄겁니다
  ): FindUserResponse {
    const input: FindUserUsecaseParams = {
      id: user.id,
      resolution,
    };

    const { birth, username, gender, job, roles, profileImage } =
      await this._findUserUseCase.execute(input);

    const response: FindUserResponseDto = {
      birth,
      username,
      gender,
      job,
      roles,
      profileImage,
    };

    return response;
  }

  async modifyUser(
    @User() user,
    @Body() modifyUserRequest: ModifyUserRequestDto,
    // @UploadedFile() profile?: MulterFile, //TODO  뺄겁니다.
  ): ModifyUserResponse {
    const input: ModifyUserUsecaseParams = {
      id: user.id,
      // profile, //TODO 삭제
      ...modifyUserRequest,
    };

    await this._modifyUserUseCase.execute(input);
  }
}
