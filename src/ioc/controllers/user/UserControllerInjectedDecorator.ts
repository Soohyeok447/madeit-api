import {
  ApiBearerAuth,
  ApiBody,
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
import {
  UserAuth,
  UserPayload,
} from '../../../adapter/common/decorators/user.decorator';
import { ModifyUserRequestDto } from '../../../adapter/user/modify-user/ModifyUserRequestDto';
import { UserController } from '../../../adapter/user/UserController';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { SwaggerInvalidUsernameResponseDto } from './swagger/SwaggerInvalidUsernameResponseDto';
import { PatchAvatarRequestDto } from '../../../adapter/user/patch-avatar/PatchAvatarRequestDto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ValidateUsernameRequestDto } from '../../../adapter/user/validate-username/ValidateUsernameRequestDto';
import { CommonUserResponseDto } from '../../../domain/use-cases/user/common/CommonUserResponseDto';
import { ValidateUsernameResponseDto } from '../../../domain/use-cases/user/validate-username/dtos/ValidateUsernameResponseDto';
import { SwaggerConflictUsernameResponseDto } from './swagger/SwaggerConflictUsernameResponseDto';
import { PatchAvatarRequestDtoV2 } from '../../../adapter/user/patch-avatar/PatchAvatarRequestDtoV2';

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
    70 - 유저가 존재하지 않음 (탈퇴 등)

    [특이사항]
    response - goal, statusMessage, avatar는 optional 필드입니다.
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    유저찾기 성공`,
    type: CommonUserResponseDto,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  public async findUser(@UserAuth() user: UserPayload): FindUserResponse {
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
    200, 400, 404

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
    status: 200,
    description: `
    유저정보 수정 성공`,
    type: CommonUserResponseDto,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @HttpCode(200)
  public async modifyUser(
    @UserAuth() user: UserPayload,
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
    String avatarId

    - OPTIONAL -
    
   
    [Response]
    201

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
    status: 201,
    description: `
    유저아바타 수정 성공`,
    type: CommonUserResponseDto,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('me/avatar')
  public async patchAvatar(
    @UserAuth() user: UserPayload,
    @Body() body: PatchAvatarRequestDtoV2,
  ): PatchAvatarResponse {
    return super.patchAvatar(user, body);
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
    type: ValidateUsernameResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: `
    유효하지 않은 닉네임`,
    type: SwaggerInvalidUsernameResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: `
    중복된 닉네임입니다.`,
    type: SwaggerConflictUsernameResponseDto,
  })
  @Post('validate')
  @HttpCode(200)
  public async validateUsername(
    @Body() validateUsernameRequest: ValidateUsernameRequestDto,
  ): ValidateUsernameResponse {
    return super.validateUsername(validateUsernameRequest);
  }
}
