import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiConsumes, ApiForbiddenResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { SwaggerJwtException, SwaggerServerException } from "src/ioc/controllers/SwaggerExceptions";
import { DoUserOnboardingRequestDto } from "src/adapter/dto/user/DoUserOnboardingRequestDto";
import { DoUserOnboardingResponse, FindUserResponse, ModifyUserResponse } from "src/domain/use-cases/user/response.index";
import { Body, Controller, Get, Injectable, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { User } from "src/adapter/common/decorators/user.decorator";
import { Resolution } from "src/domain/enums/Resolution";
import { FindUserResponseDto } from "src/domain/use-cases/user/find-user/dtos/FindUserResponseDto";
import { ModifyUserRequestDto } from "src/adapter/dto/user/ModifyUserRequestDto";
import { MulterFile } from "src/domain/types";
import { UserController } from "../../../adapter/controllers/UserController";
import { JwtAuthGuard } from "src/adapter/common/guards/JwtAuthGuard.guard";
import { ProfileImageInterceptor } from "src/adapter/common/interceptors/image.interceptor";

@ApiTags('유저 관련 API')
@Controller('v1/users')
export class UserControllerInjectedDecorator extends UserController {
  /**
   * 
   * 유저 등록 controller
   */

  @ApiOperation({
    summary: '유저 등록 API',
    description:
      '최초 가입 유저의 임시적으로 저장된 db를 완성하는 onboarding API.<br/> JWT토큰이 헤더에 포함돼야합니다. <br/>birth는 XXXX-XX-XX 의 형태로 부탁드림.',
  })
  @ApiBody({
    description: '유저 등록을 위한 form data',
    type: DoUserOnboardingRequestDto,
  })
  @ApiResponse({ status: 200, description: 'user onboarding 성공' })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 닉네임',
    type: SwaggerServerException,
  })
  @ApiUnauthorizedResponse({
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiConflictResponse({
    description: '중복된 닉네임입니다.',
    type: SwaggerServerException,
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
    description: `JWT토큰이 헤더에 포함돼야합니다.<br/>
    profileImage는 16진법으로 변환 한 buffer입니다.
    16진법에서 buffer로 conversion 필요`,
  })
  @ApiQuery({
    description: '해상도',
    type: Number,
    enum: Resolution,
    name: 'resolution',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: `유저찾기 성공<br/>
    profileImage는 16진법으로 변환 한 buffer입니다. <br/> 
    16진법에서 buffer로 conversion 필요`,
    type: FindUserResponseDto,
  })
  @ApiResponse({
    status: 460,
    description: 'customer role이 없음',
    type: SwaggerServerException,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiForbiddenResponse({
    description: '유저 등록이 필요합니다.',
    type: SwaggerServerException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findUser(
    @User() user,
    @Query('resolution') resolution: Resolution,
  ): FindUserResponse {
    return super.findUser(user, resolution);
  }

  /**
   * 
   * 유저 정보 수정 controller
   */
  @ApiOperation({
    summary: '유저 정보 수정 API',
    description:
      'JWT토큰이 헤더에 포함돼야합니다.<br/> profile image는 optional',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: `유저 등록을 위한 form data <br/> 
    try it out을 누르면 자세하게 나옴<br/>
    `,
    type: ModifyUserRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `유저정보 수정 성공`,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseInterceptors(ProfileImageInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async modifyUser(
    @User() user,
    @Body() modifyUserRequest: ModifyUserRequestDto,
    @UploadedFile() profile?: MulterFile,
  ): ModifyUserResponse {
    return super.modifyUser(user, modifyUserRequest, profile);
  }
}
