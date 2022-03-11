/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../enums/ImageType';
import { ReferenceModel } from '../../../enums/ReferenceModel';
import { ImageModel } from '../../../models/ImageModel';
import { UserModel } from '../../../models/UserModel';
import { JwtProvider } from '../../../providers/JwtProvider';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { CreateUserDto } from '../../../repositories/user/dtos/CreateUserDto';
import { UserRepository } from '../../../repositories/user/UserRepository';
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
  ) {}

  private _defaultAvatarDto: CreateImageDto = {
    type: ImageType.avatar,
    reference_model: ReferenceModel.User,
    key: 'profile',
    filenames: ['default'],
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

    const createUserDto: CreateUserDto = this._convertToCreateUserDto({
      userId,
      provider,
      age,
      goal,
      statusMessage,
      username,
    });

    const newUser: UserModel = await this._userRepository.create(createUserDto);

    const defaultAvatar: ImageModel = await this._imageRepository.create(
      this._defaultAvatarDto,
    );

    await this._userRepository.update(newUser['_id'], {
      avatar_id: defaultAvatar['_id'],
    });

    const accessToken: string = this._jwtProvider.signAccessToken(
      newUser['_id'],
    );

    const refreshToken: string = this._jwtProvider.signRefreshToken(
      newUser['_id'],
    );

    await this._userRepository.updateRefreshToken(newUser['_id'], refreshToken);

    const output: SignUpResponseDto = this._mapToResponseDto(
      newUser,
      accessToken,
      refreshToken,
    );

    return output;
  }

  private _mapToResponseDto(
    createdUser: UserModel,
    accessToken: string,
    refreshToken: string,
  ): SignUpResponseDto {
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

    return {
      accessToken,
      refreshToken,
      statusMessage: createdUser['status_message'],
      ...others,
    };
  }

  private _convertToCreateUserDto({
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
