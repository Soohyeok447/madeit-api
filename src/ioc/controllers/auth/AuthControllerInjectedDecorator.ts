import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/adapter/common/guards/JwtAuthGuard.guard';
import { JwtRefreshAuthGuard } from 'src/adapter/common/guards/JwtRefreshAuthGuard.guard';
import { AuthController } from 'src/adapter/controllers/AuthController';
import { SignInRequestDto } from 'src/adapter/dto/auth/SignInRequestDto';
import { ReissueAccessTokenResponseDto } from 'src/domain/use-cases/auth/reissue-access-token/dtos/ReissueAccessTokenResponseDto';
import {
  ReissueAccessTokenResponse,
  SignInResonse,
  SignOutResponse,
} from 'src/domain/use-cases/auth/response.index';
import { SignInResponseDto } from 'src/domain/use-cases/auth/sign-in/dtos/SignInResponseDto';
import {
  SwaggerJwtException,
  SwaggerServerException,
} from '../SwaggerExceptions';

@ApiTags('Auth 관련 API')
@Controller('v1/auth')
export class AuthControllerInjectedDecorator extends AuthController {
  @ApiOperation({
    summary: '로그인 API',
    description:
      'sdk로 받은 thirdPartyAccessToken 넘기면 서버 내부에서 검증 후, <br/>루틴 앱 자체 JWT(access,refresh)를 반환합니다. <br/>accessToken, refreshToken은 클라이언트가 가지고 있어야 합니다.',
  })
  @ApiQuery({
    name: 'provider',
    type: String,
    description: '써드파티 토큰 제공한 플랫폼',
    enum: ['kakao', 'google'],
    required: true,
  })
  @ApiBody({ description: 'thirdPartyAccessToken', type: SignInRequestDto })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: SignInResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'thirdPartyAccessToken이 유효하지 않음',
    type: SwaggerServerException,
  })
  @Post('signin')
  async signIn(
    @Body() signInRequest: SignInRequestDto,
    @Query('provider') provider: string,
  ): SignInResonse {
    return super.signIn(signInRequest, provider);
  }

  //user DB에 접근해서 refreshToken을 지워줍니다.
  @ApiOperation({
    summary: '로그아웃 API',
    description:
      'JWT토큰이 헤더에 포함돼야합니다. refreshToken을 DB에서 지웁니다.',
  })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 JWT가 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  async signOut(@User() user): SignOutResponse {
    return super.signOut(user);
  }

  //refreshToken 확인 후 accessToken을 재발급합니다.
  @ApiOperation({
    summary: 'accessToken 재발급 API',
    description:
      'JWT토큰(refreshToken)이 헤더에 포함돼야합니다. refreshToken을 검증 후 accessToken을 반환합니다. accessToken은 클라이언트가 가지고 있어야합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'accessToken 재발급 성공',
    type: ReissueAccessTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 refreshToken이 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async reissueAccessToken(
    @Headers() headers,
    @User() user,
  ): ReissueAccessTokenResponse {
    return super.reissueAccessToken(headers, user);
  }
}
