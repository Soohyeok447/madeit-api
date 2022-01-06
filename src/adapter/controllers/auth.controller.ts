import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Headers,
  UseGuards,
  Get,
  Param,
  Header,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import { AuthService } from '../../domain/auth/service/interface/auth.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { JwtRefreshAuthGuard } from '../common/guards/jwt_refresh.guard';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  SwaggerServerException,
  SwaggerJwtException,
} from '../common/swagger.dto';
import { SignInRequest } from '../dto/auth/signin.request';
import { SignInInput } from 'src/domain/auth/use-cases/integrated-sign-in/dtos/signin.input';
import { ReissueAccessTokenInput } from 'src/domain/auth/use-cases/reissue-access-token/dtos/reissue_accesstoken.input';
import { ReissueAccessTokenOutput } from 'src/domain/auth/use-cases/reissue-access-token/dtos/reissue_accesstoken.output';
import { SignInOutput } from 'src/domain/auth/use-cases/integrated-sign-in/dtos/signin.output';

@Controller('v1/auth')
@ApiTags('Auth 관련 API')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signin/:provider')
  @ApiOperation({
    summary: '로그인 API',
    description:
      'sdk로 받은 thirdPartyAccessToken 넘기면 서버 내부에서 검증 후, <br/>루틴 앱 자체 JWT(access,refresh)를 반환합니다. <br/>accessToken, refreshToken은 클라이언트가 가지고 있어야 합니다.',
  })
  @ApiParam({ name: 'provider', type: String, description:'kakao | google' })
  @ApiBody({ description: 'thirdPartyAccessToken', type: SignInRequest })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: SignInOutput,
  })
  @ApiResponse({
    status: 400,
    description: 'thirdPartyAccessToken이 유효하지 않음',
    type: SwaggerServerException,
  })
  async integratedSignIn(
    @Body() signInRequest: SignInRequest,
    @Param('provider') provider,
  ): Promise<SignInOutput> {
    const input: SignInInput = {
      provider,
      ...signInRequest,
    };

    const { accessToken, refreshToken } =
      await this.authService.integratedSignIn(input);

    return { accessToken, refreshToken };
  }

  //user DB에 접근해서 refreshToken을 지워줍니다.
  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
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
  async signOut(@User() user): Promise<void> {
    await this.authService.signOut(user.id);
  }

  //refreshToken 확인 후 accessToken을 재발급합니다.
  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiOperation({
    summary: 'accessToken 재발급 API',
    description:
      'JWT토큰(refreshToken)이 헤더에 포함돼야합니다. refreshToken을 검증 후 accessToken을 반환합니다. accessToken은 클라이언트가 가지고 있어야합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'accessToken 재발급 성공',
    type: ReissueAccessTokenOutput,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 refreshToken이 헤더에 포함돼있음',
    type: SwaggerJwtException,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  async reissueAccessToken(
    @Headers() headers,
    @User() user,
  ): Promise<ReissueAccessTokenOutput> {
    const refreshToken = headers.authorization.split(' ')[1];

    const input: ReissueAccessTokenInput = {
      refreshToken,
      id: user.id,
    };

    const { accessToken } = await this.authService.reissueAccessToken(
      input,
    );

    return { accessToken };
  }

  @Post('test')
  @ApiOperation({
    summary: 'Only Test',
    description:
      'BackEnd 개발용 테스트 entrypoint. production 배포 전 삭제 예정',
  })
  // @UseGuards(JwtAuthGuard)
  async authTest(@Body() input) {
    return await this.authService.test(input);
    // return await this.authService.test(input);
  }
}
