import { Body, Controller, Get, Patch, Post, Put, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FindUserInput } from 'src/domain/users/use-cases/find-user/dtos/find_user.input';
import { UsersService } from 'src/domain/users/service/interface/users.service';
import { User } from '../__common__/decorators/user.decorator';
import { JwtAuthGuard } from '../__common__/guards/jwt.guard';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../__common__/swagger.dto';
import { DoUserOnboardingRequest } from '../dto/user/do_user_onboarding.request';
import { DoUserOnboardingInput } from 'src/domain/users/use-cases/do-user-onboarding/dtos/do_user_onboarding.input';
import { FindUserOutput } from 'src/domain/users/use-cases/find-user/dtos/find_user.output';
import { ImageProviderImpl } from 'src/infrastructure/providers/image.provider';
import { ProfileImageInterceptor } from '../__common__/interceptors/image.interceptor';
import { MulterFile } from 'src/domain/__common__/type_alias';
import { ModifyUserRequest } from '../dto/user/modify_user.request';
import { ModifyUserInput } from 'src/domain/users/use-cases/modify-user/dtos/modify_user.input';
import { Resolution } from 'src/domain/__common__/enums/resolution.enum';

@Controller('v1/users')
@ApiTags('유저 관련 API')
export class UsersController {
  constructor(
    private readonly usersService: UsersService) { }

  @Put('onboard')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '유저 등록 API',
    description:
      '최초 가입 유저의 임시적으로 저장된 db를 완성하는 onboarding API.<br/> JWT토큰이 헤더에 포함돼야합니다. <br/>birth는 XXXX-XX-XX 의 형태로 부탁드림.',
  })
  @ApiBody({
    description: '유저 등록을 위한 form data',
    type: DoUserOnboardingRequest,
  })
  @ApiResponse({ status: 200, description: 'user onboarding 성공' })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 닉네임',
    type: SwaggerServerException
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
  async doUserOnboarding(
    @User() user,
    @Body() doUserOnboardingRequest: DoUserOnboardingRequest,
  ): Promise<void> {
    const input: DoUserOnboardingInput = {
      id: user.id,
      ...doUserOnboardingRequest,
    };

    await this.usersService.doUserOnboarding(input);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
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
    type: FindUserOutput,
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
  async findUser(
    @User() user,
    @Query('resolution') resolution: Resolution): Promise<FindUserOutput> {
    const input: FindUserInput = {
      id: user.id,
      resolution
    };

    const { id, birth, username, email, gender, job, roles, profileImage } =
      await this.usersService.findUser(input);

    const response: FindUserOutput = {
      id,
      birth,
      username,
      email,
      gender,
      job,
      roles,
      profileImage
    };

    return response;
  }

  @Put('profile')
  @ApiOperation({
    summary: '유저 정보 수정 API',
    description: 'JWT토큰이 헤더에 포함돼야합니다.<br/> profile image는 optional',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: `유저 등록을 위한 form data <br/> 
    try it out을 누르면 자세하게 나옴<br/>
    `,
    type: ModifyUserRequest,
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
  async modifyUser(
    @User() user,
    @Body() modifyUserRequest: ModifyUserRequest,
    @UploadedFile() profile?: MulterFile,
  ): Promise<void> {
    const input: ModifyUserInput = {
      id: user.id,
      profile,
      ...modifyUserRequest,
    }

    await this.usersService.modifyUser(input);
  }
}
