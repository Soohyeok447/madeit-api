import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
import { FindUserUsecaseDto } from 'src/domain/use-cases/user/use-cases/find-user/dtos/FindUserUsecaseDto';
import { UserService } from 'src/domain/use-cases/user/service/interface/UserService';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/JwtAuthGuard.guard';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../common/SwaggerExceptions';
import { DoUserOnboardingRequestDto } from '../dto/user/DoUserOnboardingRequestDto';
import { DoUserOnboardingUsecaseDto } from 'src/domain/use-cases/user/use-cases/do-user-onboarding/dtos/DoUserOnboardingUsecaseDto';
import { FindUserResponseDto } from 'src/domain/use-cases/user/use-cases/find-user/dtos/FindUserResponseDto';
import { ImageProviderImpl } from 'src/infrastructure/providers/ImageProviderImpl';
import { ProfileImageInterceptor } from '../common/interceptors/image.interceptor';
import { ModifyUserRequestDto } from '../dto/user/ModifyUserRequestDto';
import { ModifyUserUsecaseDto } from 'src/domain/use-cases/user/use-cases/modify-user/dtos/ModifyUserUsecaseDto';
import { Resolution } from 'src/domain/enums/Resolution';
import { MulterFile } from 'src/domain/types';

@Controller('v1/users')
@ApiTags('유저 관련 API')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Put('onboard')
  @UseGuards(JwtAuthGuard)
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
  async doUserOnboarding(
    @User() user,
    @Body() doUserOnboardingRequest: DoUserOnboardingRequestDto,
  ): Promise<void> {
    const input: DoUserOnboardingUsecaseDto = {
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
  async findUser(
    @User() user,
    @Query('resolution') resolution: Resolution,
  ): Promise<FindUserResponseDto> {
    const input: FindUserUsecaseDto = {
      id: user.id,
      resolution,
    };

    const { id, birth, username, email, gender, job, roles, profileImage } =
      await this.usersService.findUser(input);

    const response: FindUserResponseDto = {
      id,
      birth,
      username,
      email,
      gender,
      job,
      roles,
      profileImage,
    };

    return response;
  }

  @Put('profile')
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
  async modifyUser(
    @User() user,
    @Body() modifyUserRequest: ModifyUserRequestDto,
    @UploadedFile() profile?: MulterFile,
  ): Promise<void> {
    const input: ModifyUserUsecaseDto = {
      id: user.id,
      profile,
      ...modifyUserRequest,
    };

    await this.usersService.modifyUser(input);
  }
}