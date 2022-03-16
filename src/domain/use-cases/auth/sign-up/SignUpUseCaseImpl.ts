/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../common/enums/ImageType';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';
import { ImageModel } from '../../../models/ImageModel';
import { UserModel } from '../../../models/UserModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { JwtProvider } from '../../../providers/JwtProvider';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { CreateUserDto } from '../../../repositories/user/dtos/CreateUserDto';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { CommonUserService } from '../../user/common/CommonUserService';
import { OAuth, payload } from '../common/oauth-abstract-factory/OAuth';
import { OAuthFactory } from '../common/oauth-abstract-factory/OAuthFactory';
import { SignUpResponse } from '../response.index';
import { SignUpResponseDto } from './dtos/SignUpResponseDto';
import { SignUpUseCaseParams } from './dtos/SignUpUseCaseParams';
import { UserAlreadyRegisteredException } from './exceptions/UserAlreadyRegisteredException';
import { SignUpUseCase } from './SignUpUseCase';

@Injectable()
export class SignUpUseCaseImpl implements SignUpUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _oAuthFactory: OAuthFactory,
    private readonly _jwtProvider: JwtProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _imageProvider: ImageProvider,
  ) {}

  private _CreateDefaultAvatarDto: CreateImageDto = {
    type: ImageType.avatar,
    reference_model: ReferenceModel.User,
    cloud_keys: ['avatar/default'],
  };

  public async execute({
    provider,
    thirdPartyAccessToken,
    username,
    age,
    goal,
    statusMessage,
  }: SignUpUseCaseParams): SignUpResponse {
    const oAuth: OAuth = this._oAuthFactory.createOAuth(
      thirdPartyAccessToken,
      provider,
    );

    const payload: payload = await oAuth.verifyToken();

    const userId: string = await oAuth.getUserIdByPayload(payload);

    const existingUser: UserModel = await this._userRepository.findOneByUserId(
      userId,
    );

    if (existingUser) throw new UserAlreadyRegisteredException();

    CommonUserService.validateUsername(username);

    const createUserDto: CreateUserDto = this._convertParamsToCreateUserDto({
      userId,
      provider,
      age,
      goal,
      statusMessage,
      username,
    });

    const newUser: UserModel = await this._userRepository.create(createUserDto);

    //newUser의 Id를 레퍼런스Id로 사용해서 image객체 ImageRepository에 저장
    const defaultAvatar: ImageModel = await this._imageRepository.create({
      ...this._CreateDefaultAvatarDto,
      reference_id: newUser['_id'],
    });

    //userModel의 아바타 레퍼런스 id 업데이트
    await this._userRepository.update(newUser['_id'], {
      avatar_id: defaultAvatar['_id'],
    });

    const avatarCDN = await this._imageProvider.requestImageToCDN(
      defaultAvatar,
    );

    const accessToken: string = this._jwtProvider.signAccessToken(
      newUser['_id'],
    );

    const refreshToken: string = this._jwtProvider.signRefreshToken(
      newUser['_id'],
    );

    await this._userRepository.updateRefreshToken(newUser['_id'], refreshToken);

    const output: SignUpResponseDto = this._mapToResponseDto(
      newUser,
      avatarCDN,
      accessToken,
      refreshToken,
    );

    return output;
  }

  private _mapToResponseDto(
    createdUser: UserModel,
    avatarCDN: any,
    accessToken: string,
    refreshToken: string,
  ): SignUpResponseDto {
    return {
      accessToken,
      refreshToken,
      username: createdUser['username'],
      age: createdUser['age'],
      goal: createdUser['goal'],
      statusMessage: createdUser['status_message'],
      avatar: avatarCDN,
      point: createdUser['point'],
      exp: createdUser['exp'],
      didRoutinesInTotal: createdUser['did_routines_in_total'],
      didRoutinesInMonth: createdUser['did_routines_in_month'],
      level: createdUser['level'],
    };
  }

  private _convertParamsToCreateUserDto({
    userId,
    provider,
    age,
    goal,
    statusMessage,
    username,
  }): CreateUserDto {
    return {
      user_id: userId,
      provider,
      age,
      goal,
      status_message: statusMessage,
      username,
    };
  }
}
