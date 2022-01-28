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
  Injectable,
} from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/JwtAuthGuard.guard';
import { JwtRefreshAuthGuard } from '../common/guards/JwtRefreshAuthGuard.guard';

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
} from '../../ioc/controllers/SwaggerExceptions';
import { SignInRequestDto } from '../dto/auth/SignInRequestDto';
import { AuthService } from '../../domain/use-cases/auth/service/interface/AuthService';
import { SignInResponseDto } from '../../domain/use-cases/auth/sign-in/dtos/SignInResponseDto';
import { SignInUsecaseDto } from 'src/domain/use-cases/auth/sign-in/dtos/SignInUsecaseDto';
import { ReissueAccessTokenResponse, SignInResonse, SignOutResponse } from 'src/domain/use-cases/auth/response.index';
import { SignOutUseCaseParams } from 'src/domain/use-cases/auth/sign-out/dtos/SignOutUseCaseParams';
import { ReissueAccessTokenResponseDto } from 'src/domain/use-cases/auth/reissue-access-token/dtos/ReissueAccessTokenResponseDto';
import { ReissueAccessTokenUsecaseDto } from 'src/domain/use-cases/auth/reissue-access-token/dtos/ReissueAccessTokenUsecaseDto';

@Injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async signIn(
    @Body() signInRequest: SignInRequestDto,
    @Param('provider') provider,
  ): SignInResonse {
    const input: SignInUsecaseDto = {
      provider,
      ...signInRequest,
    };

    const { accessToken, refreshToken } =
      await this.authService.signIn(input);

    return { accessToken, refreshToken };
  }

  async signOut(@User() user): SignOutResponse {
    const input: SignOutUseCaseParams = {
      userId: user.id
    }

    await this.authService.signOut(input);
  }

  async reissueAccessToken(
    @Headers() headers,
    @User() user,
  ): ReissueAccessTokenResponse {
    const refreshToken = headers.authorization.split(' ')[1];

    const input: ReissueAccessTokenUsecaseDto = {
      refreshToken,
      id: user.id,
    };

    const { accessToken } = await this.authService.reissueAccessToken(input);

    return { accessToken };
  }
}
