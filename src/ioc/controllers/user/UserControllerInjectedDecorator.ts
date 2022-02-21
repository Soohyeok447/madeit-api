import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DoUserOnboardingRequestDto } from '../../../adapter/user/do-user-onboarding/DoUserOnboardingRequestDto';
import {
  DoUserOnboardingResponse,
  FindUserResponse,
  ModifyUserResponse,
  PatchAvatarResponse,
} from '../../../domain/use-cases/user/response.index';
import { User } from '../../../adapter/common/decorators/user.decorator';
import { FindUserResponseDto } from '../../../domain/use-cases/user/find-user/dtos/FindUserResponseDto';
import { ModifyUserRequestDto } from '../../../adapter/user/modify-user/ModifyUserRequestDto';
import { MulterFile } from '../../../domain/types';
import { UserController } from '../../../adapter/user/UserController';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { AvatarImageInterceptor } from '../../../adapter/common/interceptors/image.interceptor';
import { SwaggerUsernameConflictException } from './swagger/SwaggerUsernameConflictException';
import { SwaggerInvalidUsernameException } from './swagger/SwaggerInvalidUsernameException';
import { SwaggerUserNotRegisteredException } from './swagger/SwaggerUserNotRegisteredException';
import { PatchAvatarRequestDto } from '../../../adapter/user/patch-avatar/PatchAvatarRequestDto';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DoUserOnboardingResponseDto } from '../../../domain/use-cases/user/do-user-onboarding/dtos/DoUserOnboardingResponseDto';

@ApiTags('유저 관련 API')
@Controller('v1/users')
export class UserControllerInjectedDecorator extends UserController {
  /**
   *
   * 유저 등록 controller
   */

  @ApiOperation({
    summary: '유저 등록 API',
    description: `
      최초 가입 유저의 임시적으로 저장된 db를 완성하는 onboarding API.
      JWT토큰이 헤더에 포함돼야합니다.
      
      username REQUIRED
      age REQUIRED`,
  })
  @ApiBody({
    description: `
    유저 등록을 위한 form data`,
    type: DoUserOnboardingRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `
    user onboarding 성공`,
    type: DoUserOnboardingResponseDto
  })
  @ApiResponse({
    status: 400,
    description: `
    유효하지 않은 닉네임`,
    type: SwaggerInvalidUsernameException,
  })
  @ApiResponse({
    status: 409,
    description: `
    중복된 닉네임입니다.`,
    type: SwaggerUsernameConflictException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Put('onboard')
  async doUserOnboarding(
    @User() user,
    @Body() doUserOnboardingRequest: DoUserOnboardingRequestDto,
  ): DoUserOnboardingResponse {
    return super.doUserOnboarding(user, doUserOnboardingRequest);
  }

  /**
   *
   * 유저 본인 찾기 controller
   */
  @ApiOperation({
    summary: '유저 본인 찾기 API',
    description: `
    JWT토큰이 헤더에 포함돼야합니다`,
  })
  @ApiResponse({
    status: 200,
    description: `
    유저찾기 성공`,
    type: FindUserResponseDto,
  })
  @ApiForbiddenResponse({
    description: `
    유저 등록이 필요합니다`,
    type: SwaggerUserNotRegisteredException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findUser(@User() user): FindUserResponse {
    return super.findUser(user);
  }

  /**
   *
   * 유저 정보 수정 controller
   */
  @ApiOperation({
    summary: '유저 정보 수정 API',
    description: `
      JWT토큰이 헤더에 포함돼야합니다.`,
  })
  @ApiBody({
    description: `
    유저 정보 수정을 위한 form data`,
    type: ModifyUserRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `
    유저정보 수정 성공`,
  })
  @ApiResponse({
    status: 400,
    description: `
    유효하지 않은 닉네임`,
    type: SwaggerInvalidUsernameException,
  })
  @ApiResponse({
    status: 409,
    description: `
    중복된 닉네임입니다.`,
    type: SwaggerUsernameConflictException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async modifyUser(
    @User() user,
    @Body() modifyUserRequest: ModifyUserRequestDto,
  ): ModifyUserResponse {
    return super.modifyUser(user, modifyUserRequest);
  }

  /**
   *
   * 유저 아바타 수정 controller
   */
  @ApiOperation({
    summary: '유저 아바타 수정 API',
    description: `
      유저 아바타를 수정합니다.
      avatar (Optional).`,
  })
  @ApiBody({
    description: `
    유저 아바타`,
    type: PatchAvatarRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `
    유저아바타 수정 성공`,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AvatarImageInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('me/avatar')
  async patchAvatar(
    @User() user,
    @UploadedFile() avatar?: MulterFile,
  ): PatchAvatarResponse {
    return super.patchAvatar(user, avatar);
  }
}
