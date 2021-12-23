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
} from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import { GoogleAuthInput } from '../../domain/dto/auth/google_auth.input';
import { GoogleAuthRequest } from '../dto/auth/google_auth.request';
import { AuthService } from '../../domain/services/interfaces/auth.service';
import { GoogleAuthResponse } from '../dto/auth/google_auth.response';
import { ReissueAccessTokenResponse } from '../dto/auth/reissue_accesstoken.response';
import { ReissueAccessTokenInput } from 'src/domain/dto/auth/reissue_accesstoken.input';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { JwtRefreshAuthGuard } from '../common/guards/jwt_refresh.guard';
import { KakaoAuthRequest } from '../dto/auth/kakao_auth.request';
import { KakaoAuthResponse } from '../dto/auth/kakao_auth.response';
import { KakaoAuthInput } from 'src/domain/dto/auth/kakao_auth.input';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerServerException,SwaggerJwtException  } from '../common/swagger.dto';

@Controller('v1/auth')
@ApiTags('Auth관련 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //구글 로그인
  @Post('google')
  @ApiOperation({ summary: "구글 로그인 API", description: "구글 sdk로 받은 googleAccessToken을 넘기면 서버 내부에서 검증 후, 루틴 앱 자체 JWT(access,refresh)를 반환합니다. accessToken, refreshToken은 클라이언트가 가지고 있어야 합니다." })
  @ApiBody({description:'googleAccessToken',type:GoogleAuthRequest})
  @ApiResponse({status:200, description: 'google 로그인 성공',type: GoogleAuthResponse})
  @ApiResponse({status:400, description: 'googleAccessToken이 유효하지 않음',type: SwaggerServerException})
  async googleAuth(
    @Body() googleAuthRequest: GoogleAuthRequest,
  ): Promise<GoogleAuthResponse> {
    const { googleAccessToken } = googleAuthRequest;

    const googleAuthInput: GoogleAuthInput = { googleAccessToken };

    const { accessToken, refreshToken } =
      await this.authService.signInWithGoogleAccessToken(googleAuthInput);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('kakao')
  @ApiOperation({ summary: "카카오 로그인 API", description: "카카오 sdk로 받은 kakaoAccessToken을 넘기면 서버 내부에서 검증 후, 루틴 앱 자체 JWT(access,refresh)를 반환합니다. accessToken, refreshToken은 클라이언트가 가지고 있어야 합니다." })
  @ApiBody({description:'kakaoAccessToken',type:KakaoAuthRequest})
  @ApiResponse({status:200, description: 'kakao 로그인 성공',type: KakaoAuthResponse})
  @ApiResponse({status:400, description: 'kakaoAccessToken이 유효하지 않음',type: SwaggerServerException})
  async kakaoAuth(
    @Body() kakaoAuthRequest: KakaoAuthRequest,
  ): Promise<KakaoAuthResponse> {
    const { kakaoAccessToken } = kakaoAuthRequest;

    const kakaoAuthInput: KakaoAuthInput = { kakaoAccessToken };

    const { accessToken, refreshToken } =
      await this.authService.signInWithKakaoAccessToken(kakaoAuthInput);

    return { accessToken, refreshToken };
  }

  //user DB에 접근해서 refreshToken을 지워줍니다.
  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "로그아웃 API", description: "JWT토큰이 헤더에 포함돼야합니다. refreshToken을 DB에서 지웁니다." })
  @ApiResponse({status:200 ,description: '로그아웃 성공' })
  @ApiResponse({status:404, description: '유저를 찾을 수 없음', type:SwaggerServerException})
  @ApiResponse({status:401, description: '유효하지 않은 JWT가 헤더에 포함돼있음', type: SwaggerJwtException})
  @ApiBearerAuth('accessToken | refreshToken')
  async signOut(@User() user): Promise<void> {
    await this.authService.signOut(user.id);
  }

  //refreshToken 확인 후 accessToken을 재발급합니다.
  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiOperation({ summary: "accessToken 재발급 API", description: "JWT토큰(refreshToken)이 헤더에 포함돼야합니다. refreshToken을 검증 후 accessToken을 반환합니다. accessToken은 클라이언트가 가지고 있어야합니다." })
  @ApiResponse({status:200 ,description: 'accessToken 재발급 성공',type: ReissueAccessTokenResponse})
  @ApiResponse({status:404, description: '유저를 찾을 수 없음', type:SwaggerServerException})
  @ApiResponse({status:401, description: '유효하지 않은 refreshToken이 헤더에 포함돼있음', type: SwaggerJwtException})
  @ApiBearerAuth('accessToken | refreshToken')
  async reissueAccessToken(
    @Headers() headers,
    @User() user,
  ): Promise<ReissueAccessTokenResponse> {
    const refreshToken = headers.authorization.split(' ')[1];

    const reissueAccessTokenInput: ReissueAccessTokenInput = {
      refreshToken,
      id: user.id,
    };

    const { accessToken } = await this.authService.reissueAccessToken(
      reissueAccessTokenInput,
    );

    return { accessToken };
  }

  @Post('test')
  @ApiOperation({ summary: "Only Test", description: "BackEnd 개발용 테스트 entrypoint. production 배포 전 삭제 예정" })
  @UseGuards(JwtAuthGuard)
  async authTest(@Body() input) {
    return await this.authService.test(input);
    // return await this.authService.test(input);
  }
}
