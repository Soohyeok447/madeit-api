/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ImageModel } from '../../../models/ImageModel';
import { UserModel } from '../../../models/UserModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { FindUserResponse } from '../response.index';
import { CommonUserService } from '../common/CommonUserService';
import { FindUserUsecaseParams } from './dtos/FindUserUsecaseParams';
import { UserNotRegisteredException } from './exceptions/UserNotRegisteredException';
import { FindUserUseCase } from './FindUserUseCase';
import { CommonUserResponseDto } from '../common/CommonUserResponseDto';

@Injectable()
export class FindUserUseCaseImpl implements FindUserUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
  ) {}

  public async execute({ id }: FindUserUsecaseParams): FindUserResponse {
    const user: UserModel = await this._userRepository.findOne(id);

    CommonUserService.assertUserExistence(user);

    this._assertUserRegistration(user);

    const existingAvatar: ImageModel = user['avatar_id'];

    const avatarUrl = await this._getAvatarUrl(existingAvatar);

    const output: CommonUserResponseDto = this._mapToResponseDto(
      avatarUrl,
      user,
    );

    return output;
  }

  private _assertUserRegistration(user: UserModel) {
    if (!user.age || !user.username) {
      throw new UserNotRegisteredException();
    }
  }

  private async _getAvatarUrl(profile: ImageModel) {
    const profileModel = this._imageProvider.mapDocumentToImageModel(profile);

    return await this._imageProvider.requestImageToCloudfront(profileModel);
  }

  private _mapToResponseDto(
    avatar: any,
    user: UserModel,
  ): CommonUserResponseDto {
    return {
      username: user['username'],
      age: user['age'],
      goal: user['goal'],
      statusMessage: user['status_message'],
      avatar,
      point: user['point'],
      exp: user['exp'],
      didRoutinesInTotal: user['did_routines_in_total'],
      didRoutinesInMonth: user['did_routines_in_month'],
      level: user['level'],
    };
  }
}
