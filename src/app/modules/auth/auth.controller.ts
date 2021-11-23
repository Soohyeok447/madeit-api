import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get_user.decorator';
import { AuthCredentialDto } from './dto/auth_credential.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtRefreshAuthGuard } from './guards/jwt_refresh.guard';
import { SignInResult } from './result/SignIn.result';
import { SignOutResult } from './result/signout.result';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  //폼 로그인 엔트리포인트
  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() authCredentialDto: AuthCredentialDto): Promise<SignInResult> {
    const result = await this.authService.signIn(authCredentialDto);

    return { accessToken: result.accessToken, refreshToken: result.refreshToken };
  }

  //user DB에 접근해서 refreshToken을 지워줍니다.
  @Post('signout')
  @UseGuards(JwtAuthGuard)
  async signOut(@GetUser() user): Promise<SignOutResult>{
    return await this.authService.signOut(user.email);
  }

  @Post('test')
  @UseGuards(JwtAuthGuard)
  async authTest(@GetUser() user){
      return user;
  }

  // /**
  //  * 토큰 리프레시 엔트리포인트 refreshToken이 Authorization header에 포함돼야한다.
  //  * Header로 받을지 body로 받을지 정해진 뒤 토큰 받기
  //  * refresh to reissue accessToken
  // */
  //@UseGuards(JwtRefreshAuthGuard)
  // async refresh() { }
}
