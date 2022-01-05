import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FindUserInput } from 'src/domain/users/use-cases/find-user/dtos/find_user.input';
import { UsersService } from 'src/domain/users/service/interface/users.service';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../common/swagger.dto';
import { DoUserOnboardingRequest } from '../dto/user/do_user_onboarding.request';
import { FindUserResponse } from '../dto/user/find_user.response';
import { DoUserOnboardingInput } from 'src/domain/users/use-cases/do-user-onboarding/dtos/do_user_onboarding.input';

@Controller('v1/users')
@ApiTags('유저 관련 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('me/onboard')
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
    description: 'JWT토큰이 헤더에 포함돼야합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '유저찾기 성공',
    type: FindUserResponse,
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
  async findUser(@User() user): Promise<FindUserResponse> {
    const input: FindUserInput = {
      id: user.id,
    };

    const { id, birth, username, email, gender, job, roles } =
      await this.usersService.findUser(input);

    const response = {
      id,
      birth,
      username,
      email,
      gender,
      job,
      roles,
    };

    return response;
  }
}
