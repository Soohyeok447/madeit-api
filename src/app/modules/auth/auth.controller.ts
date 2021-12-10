import { Body, Controller, HttpCode, Post, Req, Headers, UseGuards, Get, Param, Header } from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { GoogleOauthInput, GoogleOauthOutput } from './dto/google_oauth.dto';
import { RefreshOutput } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtRefreshAuthGuard } from './guards/jwt_refresh.guard';
import { AuthService } from './interfaces/auth.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }


  //구글 로그인
  @Post('google')
  async googleAuth(
    @Body() googleOauthInput: GoogleOauthInput,
  ): Promise<GoogleOauthOutput> {
    const { accessToken, refreshToken } = await this.authService.googleAuth(googleOauthInput);

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
  async reissueAccessToken(@Headers() headers, @User() user): Promise<RefreshOutput> {
    const refreshToken = headers.authorization.split(' ')[1];

    const { accessToken } = await this.authService.reissueAccessToken(refreshToken, user.id);

    return { accessToken };
  }

  @Post('test')
  @UseGuards(JwtAuthGuard)
  async authTest(@User() user) {
    return user;
  }
}
