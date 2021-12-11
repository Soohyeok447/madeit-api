import { Body, Controller, HttpCode, Post, Req, Headers, UseGuards, Get, Param, Header } from '@nestjs/common';
import { User } from '../../app/modules/auth/decorators/user.decorator';
import { GoogleAuthInput } from '../../app/modules/auth/dto/google_auth.input';
import { GoogleAuthRequest } from '../../app/modules/auth/dto/google_auth.request';
import { GoogleAuthResponse } from '../../app/modules/auth/dto/google_auth.response';
import { ReissueAccessTokenInput } from '../../app/modules/auth/dto/reissue_accesstoken.input';
import { ReissueAccessTokenResponse } from '../../app/modules/auth/dto/reissue_accesstoken.response';
import { JwtAuthGuard } from '../../app/modules/auth/guards/jwt.guard';
import { JwtRefreshAuthGuard } from '../../app/modules/auth/guards/jwt_refresh.guard';
import { AuthService } from '../services/auth.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }


  //구글 로그인
  @Post('google')
  async googleAuth(
    @Body() googleAuthRequest: GoogleAuthRequest,
  ): Promise<GoogleAuthResponse> {
    const { googleAccessToken } = googleAuthRequest;

    const googleAuthInput: GoogleAuthInput = { googleAccessToken };

    const { accessToken, refreshToken } = await this.authService.googleAuth(googleAuthInput);

    return {
      accessToken,
      refreshToken
    }
  }


  //user DB에 접근해서 refreshToken을 지워줍니다.
  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async signOut(@User() user): Promise<void> {
    await this.authService.signOut(user.id);
  }

  //refreshToken 확인 후 accessToken을 재발급합니다.
  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async reissueAccessToken(@Headers() headers, @User() user): Promise<ReissueAccessTokenResponse> {
    const refreshToken = headers.authorization.split(' ')[1];

    const reissueAccessTokenInput: ReissueAccessTokenInput = {
      refreshToken,
      id: user.id
    }

    const { accessToken } = await this.authService.reissueAccessToken(reissueAccessTokenInput);

    return { accessToken };
  }

  @Post('test')
  @UseGuards(JwtAuthGuard)
  async authTest(@User() user) {
    return user;
  }
}
