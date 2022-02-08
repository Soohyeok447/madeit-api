import {
  Body,
  Controller,
  Delete,
  Injectable,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { User } from 'src/adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/adapter/common/guards/JwtAuthGuard.guard';
import { AvatarImageInterceptor } from 'src/adapter/common/interceptors/image.interceptor';
import { Role } from 'src/domain/enums/Role';
import { UserModel } from 'src/domain/models/UserModel';
import { CreateUserDto } from 'src/domain/repositories/user/dtos/CreateUserDto';
import { UserRepository } from 'src/domain/repositories/user/UserRepository';
import { MulterFile } from 'src/domain/types';
import { SignInResonse } from 'src/domain/use-cases/auth/response.index';
import { AuthCommonService } from 'src/domain/use-cases/auth/service/AuthCommonService';
import { SignInResponseDto } from 'src/domain/use-cases/auth/sign-in/dtos/SignInResponseDto';
import { KakaoInvalidTokenException } from 'src/domain/use-cases/auth/sign-in/exceptions/kakao/KakaoInvalidTokenException';

@Injectable()
@Controller('v1/e2e')
export class E2EController {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _jwtService: JwtService,
  ) { }

  @ApiExcludeEndpoint()
  @Post('auth/signin')
  async e2eSignin(
    @Body() signInRequest: SignInRequestDto,
    @Query('provider') provider: string,
    @Query('id') userId: string,
  ): SignInResonse {
    if (provider !== 'kakao') {
      throw new KakaoInvalidTokenException();
    }

    if (signInRequest.thirdPartyAccessToken === 'wrongToken') {
      throw new KakaoInvalidTokenException();
    }

    const user = await this.createOrFindUserByExistence(userId);

    const token = await this.issueAccessTokenAndRefreshToken(user);

    return token;
  }

  @ApiExcludeEndpoint()
  @Patch('user')
  @UseGuards(JwtAuthGuard)
  async e2ePatchUserToAdmin(
    @User() user,
  ): Promise<void> {
    await this._userRepository.update(user.id,{
      is_admin: true
    })
  }

  @ApiExcludeEndpoint()
  @Delete('image')
  @UseInterceptors(AvatarImageInterceptor)
  @UseGuards(JwtAuthGuard)
  async e2eDeleteAvatar(
    @UploadedFile() avatar: MulterFile,
  ){
    
  }


  private async createOrFindUserByExistence(userId: string): Promise<UserModel> {
    let user = await this._userRepository.findOneByUserId(userId);

    if (!user) {
      user = await this.createTemporaryUser({
        userId,
        provider: 'kakao',
      });
    }

    return user;
  }

  private async createTemporaryUser({
    userId,
    provider,
  }: {
    userId: string;
    provider: string;
  }) {
    const temporaryUser: CreateUserDto = {
      provider,
      user_id: userId,
      roles: Role.customer,
      is_admin: false,
    };

    return await this._userRepository.create(temporaryUser);
  }

  private async issueAccessTokenAndRefreshToken(user: UserModel) {
    const { refreshToken, accessToken } = this.createTokenPairs(user["_id"]);

    await this._userRepository.updateRefreshToken(user['_id'], refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private createTokenPairs(id: string) {
    const accessToken: string = this.createNewAccessToken(id);

    const refreshToken: string = this.createNewRefreshToken(id);

    return { refreshToken, accessToken };
  }

  private createNewRefreshToken(id: string): string {
    return this._jwtService.sign(
      { id },
      {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
        issuer: `${process.env.JWT_ISSUER}`,
      },
    );
  }

  private createNewAccessToken(id: string): string {
    return this._jwtService.sign(
      { id },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
        issuer: `${process.env.JWT_ISSUER}`,
      },
    );
  }
}
