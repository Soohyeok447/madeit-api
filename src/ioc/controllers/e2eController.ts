import {
  Body,
  Controller,
  HttpCode,
  Injectable,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { SignInRequestDto } from '../../adapter/auth/sign-in/SignInRequestDto';
import { ValidateRequestDto } from '../../adapter/auth/validate/ValidateRequestDto';
import { User } from '../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../adapter/common/guards/JwtAuthGuard.guard';
import { UserModel } from '../../domain/models/UserModel';
import { CreateUserDto } from '../../domain/repositories/user/dtos/CreateUserDto';
import { UserRepository } from '../../domain/repositories/user/UserRepository';
import { Provider } from '../../domain/use-cases/auth/common/types/provider';
import { SignInResponse } from '../../domain/use-cases/auth/response.index';
import { GoogleInvalidTokenException } from '../../domain/use-cases/auth/common/exceptions/google/GoogleInvalidTokenException';
import { InvalidProviderException } from '../../domain/use-cases/auth/common/exceptions/InvalidProviderException';
import { KakaoInvalidTokenException } from '../../domain/use-cases/auth/common/exceptions/kakao/KakaoInvalidTokenException';
import { CommonUserService } from '../../domain/use-cases/user/service/CommonUserService';
import { SignUpRequestDto } from '../../adapter/auth/sign-up/SignUpRequestDto';
import { JwtProvider } from '../../domain/providers/JwtProvider';
import { SignUpResponseDto } from '../../domain/use-cases/auth/sign-up/dtos/SignUpResponseDto';
import { UserAlreadyRegisteredException } from '../../domain/use-cases/auth/sign-up/exceptions/UserAlreadyRegisteredException';

@Injectable()
@Controller('v1/e2e')
export class E2EController {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _jwtProvider: JwtProvider,
  ) {}

  @ApiExcludeEndpoint()
  @Post('auth/validate')
  @HttpCode(200)
  async e2eValidate(
    @Body() validateRequest: ValidateRequestDto,
    @Query('provider') provider: string,
  ): SignInResponse {
    if (provider !== Provider.kakao) {
      throw new InvalidProviderException();
    }

    if (
      validateRequest.thirdPartyAccessToken === 'wrongToken' &&
      provider === Provider.kakao
    ) {
      throw new KakaoInvalidTokenException();
    }

    const user: UserModel = await this._userRepository.findOneByUserId(
      'e2etest',
    );

    CommonUserService.assertUserExistence(user);

    return {};
  }

  @ApiExcludeEndpoint()
  @Post('auth/signup')
  async e2eSignUp(
    @Body() signUpRequest: SignUpRequestDto,
    @Query('provider') provider: string,
  ): SignInResponse {
    if (provider !== 'kakao') {
      throw new InvalidProviderException();
    }

    if (
      signUpRequest.thirdPartyAccessToken === 'wrongToken' &&
      provider === Provider.kakao
    ) {
      throw new KakaoInvalidTokenException();
    }

    const user: UserModel = await this._userRepository.findOneByUserId(
      'e2etest',
    );

    if (user) throw new UserAlreadyRegisteredException();

    const createUserDto: CreateUserDto = {
      user_id: 'e2etest',
      provider,
      username: signUpRequest.username,
      age: signUpRequest.age,
      goal: signUpRequest.goal,
      status_message: signUpRequest.statusMessage,
    };

    const createdUser: UserModel = await this._userRepository.create(
      createUserDto,
    );

    const accessToken: string = this._jwtProvider.signAccessToken(
      createdUser['_id'],
    );

    const refreshToken: string = this._jwtProvider.signRefreshToken(
      createdUser['_id'],
    );

    await this._userRepository.updateRefreshToken(
      createdUser['_id'],
      refreshToken,
    );

    const {
      status_message: _,
      created_at: __,
      refresh_token: ___,
      _id: ____,
      updated_at: _____,
      is_admin: ______,
      user_id: _______,
      provider: ________,
      ...others
    }: any = createdUser;

    const output: SignUpResponseDto = {
      accessToken,
      refreshToken,
      statusMessage: createdUser['status_message'],
      ...others,
    };

    return output;
  }

  @ApiExcludeEndpoint()
  @Post('auth/signin')
  @HttpCode(200)
  async e2eSignin(
    @Body() signInRequest: SignInRequestDto,
    @Query('provider') provider: string,
  ): SignInResponse {
    if (provider !== 'kakao') {
      throw new InvalidProviderException();
    }

    if (signInRequest.thirdPartyAccessToken === 'wrongToken') {
      throw new KakaoInvalidTokenException();
    }

    const user: UserModel = await this._userRepository.findOneByUserId(
      'e2etest',
    );

    CommonUserService.assertUserExistence(user);

    const accessToken: string = this._jwtProvider.signAccessToken(user['_id']);

    const refreshToken: string = this._jwtProvider.signRefreshToken(
      user['_id'],
    );

    await this._userRepository.updateRefreshToken(user['_id'], refreshToken);

    const {
      status_message: _,
      created_at: __,
      refresh_token: ___,
      _id: ____,
      updated_at: _____,
      is_admin: ______,
      user_id: _______,
      provider: ________,
      ...others
    }: any = user;

    const output: SignUpResponseDto = {
      accessToken,
      refreshToken,
      statusMessage: user['status_message'],
      ...others,
    };

    return output;
  }

  @ApiExcludeEndpoint()
  @Patch('user')
  @UseGuards(JwtAuthGuard)
  async e2ePatchUserToAdmin(@User() user): Promise<void> {
    await this._userRepository.update(user.id, {
      is_admin: true,
    });
  }
}
