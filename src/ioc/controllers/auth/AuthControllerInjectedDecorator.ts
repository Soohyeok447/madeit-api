import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { JwtRefreshAuthGuard } from '../../../adapter/common/guards/JwtRefreshAuthGuard.guard';
import { AuthController } from '../../../adapter/auth/AuthController';
import { SignInRequestDto } from '../../../adapter/auth/sign-in/SignInRequestDto';
import { ReissueAccessTokenResponseDto } from '../../../domain/use-cases/auth/reissue-access-token/dtos/ReissueAccessTokenResponseDto';
import {
  ReissueAccessTokenResponse,
  SignInResonse,
  SignOutResponse,
  WithdrawResponse,
} from '../../../domain/use-cases/auth/response.index';
import { SignInResponseDto } from '../../../domain/use-cases/auth/sign-in/dtos/SignInResponseDto';
import { SwaggerInvalidProviderException } from './swagger/SwaggerInvalidProviderException';

@ApiTags('Auth 관련 API')
@Controller('v1/auth')
export class AuthControllerInjectedDecorator extends AuthController {
  @ApiOperation({
    summary: '로그인 API',
    description: `
    accessToken, refreshToken은 클라이언트가 가지고 있어야 합니다

    refreshToken -> reissue용
    accessToken -> api 이용

    [Request Query]
    String kakao | String google

    [Request body]
    - REQUIRED - 
    String thirdPartyAccessToken

    - OPTIONAL -
   
    [Response]
    200, 400, 503

    [에러코드]
    1 - 유효하지 않은 provider query
    2 - kakao 서버 에러 (503)
    3 - 유효하지 않은 kakao 토큰
    4 - kakao 토큰 만료
    5 - 유효하지 않은 google 토큰(만료포함)
    6 - 승인되지 않은 구글 계정
    
    `,
  })
  @ApiQuery({
    name: `provider`,
    type: String,
    description: `
    써드파티 토큰 제공한 플랫폼`,
    enum: ['kakao', 'google'],
    required: true,
  })
  @ApiBody({
    description: `
    로그인을 위한 써드파티 토큰`,
    type: SignInRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `
    로그인 성공`,
    type: SignInResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: `
    provider query 잘못보냈을 경우 | thirdPartyAccessToken 문제`,
    type: SwaggerInvalidProviderException,
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
    description: `
    [Request headers]
    api access token

    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    200

    [에러코드]
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    로그아웃 성공`,
    type: Object,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  async signOut(@User() user): SignOutResponse {
    return super.signOut(user);
  }

  //회원 탈퇴
  @ApiOperation({
    summary: '회원 탈퇴 API',
    description: `
    [Request headers]
    api access token

    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    200

    [에러코드]
    70 - 유저가 존재하지 않음 (탈퇴 등)
    `,
  })
  @ApiResponse({
    status: 200,
    description: `
    회원 탈퇴 성공`,
    type: Object,
  })
  @ApiBearerAuth('accessToken | refreshToken')
  @UseGuards(JwtAuthGuard)
  @Patch('withdraw')
  @HttpCode(200)
  async withdraw(@User() user): WithdrawResponse {
    return super.withdraw(user);
  }

  //refreshToken 확인 후 accessToken을 재발급합니다.
  @ApiOperation({
    summary: 'accessToken 재발급 API',
    description: `
    [Request headers]
    api refresh token

    [Request body]
    - REQUIRED - 

    - OPTIONAL -
   
    [Response]
    201

    [에러코드]
    70 - 유저가 존재하지 않음 (탈퇴 등)
    `,
  })
  @ApiResponse({
    status: 201,
    description: `
    accessToken 재발급 성공`,
    type: ReissueAccessTokenResponseDto,
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
