import {
  Body,
  Controller,
  Headers,
  HttpCode,
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
import {
  UserAuth,
  UserPayload,
} from '../../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { JwtRefreshAuthGuard } from '../../../adapter/common/guards/JwtRefreshAuthGuard.guard';
import { AuthController } from '../../../adapter/auth/AuthController';
import { SignInRequestDto } from '../../../adapter/auth/sign-in/SignInRequestDto';
import { ReissueAccessTokenResponseDto } from '../../../domain/use-cases/auth/reissue-access-token/dtos/ReissueAccessTokenResponseDto';
import {
  ReissueAccessTokenResponse,
  SignInResponse,
  SignOutResponse,
  SignUpResponse,
  ValidateResponse,
  WithdrawResponse,
} from '../../../domain/use-cases/auth/response.index';
import { SignInResponseDto } from '../../../domain/use-cases/auth/sign-in/dtos/SignInResponseDto';
import { SwaggerInvalidProviderException } from './swagger/SwaggerInvalidProviderException';
import { Provider } from '../../../domain/use-cases/auth/common/types/provider';
import { ValidateRequestDto } from '../../../adapter/auth/validate/ValidateRequestDto';
import { SignUpRequestDto } from '../../../adapter/auth/sign-up/SignUpRequestDto';
import { SignUpResponseDto } from '../../../domain/use-cases/auth/sign-up/dtos/SignUpResponseDto';
import { SwaggerUserAlreadyRegistrationException } from './swagger/SwaggerUserAlreadyRegistrationException';
import { ValidateResponseDto } from '../../../domain/use-cases/auth/validate/dtos/ValidateResponseDto';
import { SwaggerValidateResponseDto } from './swagger/SwaggerValidateResponseDto';

@ApiTags('Auth 관련 API')
@Controller('v1/auth')
export class AuthControllerInjectedDecorator extends AuthController {
  @ApiOperation({
    summary: '유저 가입여부 검사 API',
    description: `
    signin, signup 전에 이미 가입한 유저인지
    validate를 합니다

    google oauth, kakao oauth 하기 전에는
    무조건 이 API가 선행되어야 합니다.

    validate API 호출 시, 유저의 가입여부에 따라
    200 {}, 404 UserNotRegisteredException 를 response합니다.

    statusCode가 200이면 signIn을 호출하면 되고
    statusCode가 404이면 signUp을 호출하면 됩니다.

    [Request Query]
    String kakao | String google

    [Request body]
    - REQUIRED - 
    String thirdPartyAccessToken

    - OPTIONAL -
   
    [Response]
    200, 400, 404

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
    유저 가입여부 검증을 위한 써드파티 토큰`,
    type: ValidateRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: `
    유저가 이미 가입 되어있음`,
    type: ValidateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: `
    provider query 잘못보냈을 경우 | thirdPartyAccessToken 문제`,
    type: SwaggerInvalidProviderException,
  })
  @ApiResponse({
    status: 404,
    description: `
    유저가 가입 되어있지 앟음`,
    type: SwaggerValidateResponseDto,
  })
  @Post('validate')
  @HttpCode(200)
  public async validate(
    @Body() validateRequest: ValidateRequestDto,
    @Query('provider') provider: Provider,
  ): ValidateResponse {
    return super.validate(validateRequest, provider);
  }

  @ApiOperation({
    summary: '회원가입 API',
    description: `
    validate API 호출 이후
    response statusCode가 404이면

    signup API를 호출하면 됩니다.

    회원가입을 진행한 후
    onboarding fields와 accessToken, refreshToken을 반환합니다. 


    [Request Query]
    String kakao | String google

    [Request body]
    - REQUIRED - 
    String thirdPartyAccessToken
    String username
    Int age

    - OPTIONAL -
    String goal
    String statusMessage
   
    [Response]
    201, 400, 503

    [에러코드]
    1 - 유효하지 않은 provider query
    2 - kakao 서버 에러 (503)
    3 - 유효하지 않은 kakao 토큰
    4 - kakao 토큰 만료
    5 - 유효하지 않은 google 토큰(만료포함)
    6 - 승인되지 않은 구글 계정
    7 - 유저가 이미 가입 됨
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
    회원가입을 위한 써드파티 토큰`,
    type: SignUpRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: `
    회원가입 성공`,
    type: SignUpResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: `
    provider query 잘못보냈을 경우 | thirdPartyAccessToken 문제`,
    type: SwaggerInvalidProviderException,
  })
  @ApiResponse({
    status: 409,
    description: `
    유저가 이미 가입 됨`,
    type: SwaggerUserAlreadyRegistrationException,
  })
  @Post('signup')
  public async signUp(
    @Body() signUpRequest: SignUpRequestDto,
    @Query('provider') provider: Provider,
  ): SignUpResponse {
    return super.signUp(signUpRequest, provider);
  }

  @ApiOperation({
    summary: '로그인 API',
    description: `
    validate API 호출 이후
    response statusCode가 200이면

    signIn API를 호출하면 됩니다.

    회원가입없이 accessToken, refreshToken을 반환합니다. 


    [Request Query]
    String kakao | String google

    [Request body]
    - REQUIRED - 
    String thirdPartyAccessToken

    - OPTIONAL -
   
    [Response]
    200, 400

    [에러코드]
    1 - 유효하지 않은 provider query
    2 - kakao 서버 에러
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
  @HttpCode(200)
  public async signIn(
    @Body() signInRequest: SignInRequestDto,
    @Query('provider') provider: Provider,
  ): SignInResponse {
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
    1 - 이미 로그아웃한 상태입니다 (403)
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
  @HttpCode(200)
  @Post('signout')
  public async signOut(@UserAuth() user: UserPayload): SignOutResponse {
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
  public async withdraw(@UserAuth() user: UserPayload): WithdrawResponse {
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
    1 - 이미 로그아웃한 상태입니다 (403)
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
  public async reissueAccessToken(
    @Headers() headers: any,
    @UserAuth() user: UserPayload,
  ): ReissueAccessTokenResponse {
    return super.reissueAccessToken(headers, user);
  }
}
