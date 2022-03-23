/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { SignInRequestDto } from '../../adapter/auth/sign-in/SignInRequestDto';
import { ValidateRequestDto } from '../../adapter/auth/validate/ValidateRequestDto';
import { UserAuth } from '../../adapter/common/decorators/user.decorator';
import { JwtAuthGuard } from '../../adapter/common/guards/JwtAuthGuard.guard';
import { UserModel } from '../../domain/models/UserModel';
import { CreateUserDto } from '../../domain/repositories/user/dtos/CreateUserDto';
import { UserRepository } from '../../domain/repositories/user/UserRepository';
import { Provider } from '../../domain/use-cases/auth/common/types/provider';
import { SignInResponse } from '../../domain/use-cases/auth/response.index';
import { InvalidProviderException } from '../../domain/use-cases/auth/common/exceptions/InvalidProviderException';

import { SignUpRequestDto } from '../../adapter/auth/sign-up/SignUpRequestDto';
import { JwtProvider } from '../../domain/providers/JwtProvider';
import { SignUpResponseDto } from '../../domain/use-cases/auth/sign-up/dtos/SignUpResponseDto';
import { UserAlreadyRegisteredException } from '../../domain/use-cases/auth/sign-up/exceptions/UserAlreadyRegisteredException';
import { CreateImageDto } from '../../domain/repositories/image/dtos/CreateImageDto';
import { ImageModel } from '../../domain/models/ImageModel';
import { ImageRepository } from '../../domain/repositories/image/ImageRepository';
import { ImageType } from '../../domain/common/enums/ImageType';
import { ReferenceModel } from '../../domain/common/enums/ReferenceModel';
import { KakaoInvalidTokenException } from '../../domain/use-cases/auth/common/exceptions/kakao/KakaoInvalidTokenException';
import { UserNotFoundException } from '../../domain/common/exceptions/customs/UserNotFoundException';
import { SignInResponseDto } from '../../domain/use-cases/auth/sign-in/dtos/SignInResponseDto';

@Injectable()
@Controller('v1/e2e')
export class E2EController {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _jwtProvider: JwtProvider,
    private readonly _imageRepository: ImageRepository,
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

    const user = await this._userRepository.findOneByUserId('e2etest');

    if (!user) throw new UserNotFoundException();

    return {};
  }

  private _defaultAvatarDto: CreateImageDto = {
    type: ImageType.avatar,
    reference_model: ReferenceModel.User,
    cloud_keys: ['avatar'],
  };

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

    const user = await this._userRepository.findOneByUserId('e2etest');

    if (user) throw new UserAlreadyRegisteredException();

    const createUserDto: CreateUserDto = {
      userId: 'e2etest',
      provider: Provider.kakao,
      username: signUpRequest.username,
      age: signUpRequest.age,
      goal: signUpRequest.goal,
      statusMessage: signUpRequest.statusMessage,
    };

    const newUser = await this._userRepository.create(createUserDto);

    const defaultAvatar: ImageModel = await this._imageRepository.create(
      this._defaultAvatarDto,
    );

    await this._userRepository.update(newUser.id, {
      avatar: defaultAvatar['_id'],
    });

    const accessToken: string = this._jwtProvider.signAccessToken(newUser.id);

    const refreshToken: string = this._jwtProvider.signRefreshToken(newUser.id);

    await this._userRepository.updateRefreshToken(newUser.id, refreshToken);

    const output: SignUpResponseDto = {
      accessToken,
      refreshToken,
      statusMessage: newUser.statusMessage,
      username: newUser.username,
      age: newUser.age,
      goal: newUser.goal,
      point: newUser.point,
      exp: newUser.exp,
      didRoutinesInTotal: newUser.didRoutinesInTotal,
      didRoutinesInMonth: newUser.didRoutinesInMonth,
      level: newUser.level,
      avatar: newUser.avatar,
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

    const user = await this._userRepository.findOneByUserId('e2etest');

    if (!user) throw new UserNotFoundException();

    const accessToken: string = this._jwtProvider.signAccessToken(user.id);

    const refreshToken: string = this._jwtProvider.signRefreshToken(user.id);

    await this._userRepository.updateRefreshToken(user['_id'], refreshToken);

    const output: SignInResponseDto = {
      accessToken,
      refreshToken,
    };

    return output;
  }

  @ApiExcludeEndpoint()
  @Patch('user')
  @UseGuards(JwtAuthGuard)
  async e2ePatchUserToAdmin(@UserAuth() user): Promise<void> {
    await this._userRepository.update(user.id, {
      isAdmin: true,
    });
  }
}
