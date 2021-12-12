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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //구글 로그인
  @Post('google')
  async googleAuth(
    @Body() googleAuthRequest: GoogleAuthRequest,
  ): Promise<GoogleAuthResponse> {
    const { googleAccessToken } = googleAuthRequest;

    const googleAuthInput: GoogleAuthInput = { googleAccessToken };

    const { accessToken, refreshToken } = await this.authService.googleAuth(
      googleAuthInput,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  //user DB에 접근해서 refreshToken을 지워줍니다.
  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(@User() user): Promise<void> {
    await this.authService.signOut(user.id);
  }

  //refreshToken 확인 후 accessToken을 재발급합니다.
  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async authTest(@User() user) {
    return user;
  }
}
