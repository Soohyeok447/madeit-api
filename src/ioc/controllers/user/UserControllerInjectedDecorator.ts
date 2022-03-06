import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  FindUserResponse,
  ModifyUserResponse,
  PatchAvatarResponse,
  ValidateUsernameResponse,
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
  HttpCode,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ValidateUsernameRequestDto } from '../../../adapter/user/validate-username/ValidateUsernameRequestDto';

@ApiTags('유저 관련 API')
@Controller('v1/users')
export class UserControllerInjectedDecorator extends UserController {
  /**
   *
   * 유저 본인 찾기 controller
   */
  @ApiOperation({
    summary: '유저 본인 찾기 API',
    description: `
    [Request headers]
    api access token

    [Request body]
    - REQUIRED - 

    - OPTIONAL -

    [Response]
    200, 403

    [에러코드]
    1 - 유저 등록이 필요함
    70 - 유저가 존재하지 않음 (탈퇴 등)

    [특이사항]
    response - goal, statusMessage, avatar는 optional 필드입니다.
    `,
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
    [Request headers]
    api access token

    [Request body]
    - REQUIRED - 

    - OPTIONAL -
    String username
    String goal
    String statusMessage
    Int age
    
    [Response]
    204

    [에러코드]
    70 - 유저가 존재하지 않음 (탈퇴 등)
    `,
  })
  @ApiBody({
    description: `
    유저 정보 수정을 위한 form data`,
    type: ModifyUserRequestDto,
  })
  @ApiResponse({
    status: 204,
    description: `
    유저정보 수정 성공`,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @HttpCode(204)
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
    [Request headers]
    api access token

    [Request body]
    - REQUIRED - 
    Binary avatar

    - OPTIONAL -
   
    [Response]
    200

    [에러코드]
    70 - 유저가 존재하지 않음 (탈퇴 등)
    `,
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
    type: Object,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AvatarImageInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('me/avatar')
  @HttpCode(200)
  async patchAvatar(
    @User() user,
    @UploadedFile() avatar?: MulterFile,
  ): PatchAvatarResponse {
    return super.patchAvatar(user, avatar);
  }

  /**
   *
   * 유저네임 유효성검사
   */
  @ApiOperation({
    summary: '유저네임 유효성 검사 API',
    description: `
    username은 2자 이상 ~ 8자 이하, 중복 X

    [Request headers]
    api access token

    [Request body]
    - REQUIRED - 
    String username 

    - OPTIONAL -

    [Response]
    204, 400, 409

    [에러코드]
    1 : 2자 이하 8자 이하인 username
    2 : 중복된 username
    `,
  })
  @ApiBody({
    description: `
    유효성 검사를 위한 유저이름`,
    type: ValidateUsernameRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `
    유효성검사 통과`,
    type: Object,
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
  @Post('validate')
  @HttpCode(200)
  async validateUsername(
    @Body() validateUsernameRequest: ValidateUsernameRequestDto,
  ): ValidateUsernameResponse {
    return super.validateUsername(validateUsernameRequest);
  }
}
