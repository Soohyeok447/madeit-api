/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ModifyUserUsecaseParams } from './dtos/ModifyUserUsecaseParams';
import { UpdateUserDto } from '../../../repositories/user/dtos/UpdateUserDto';
import { ModifyUserResponse } from '../response.index';
import { ModifyUserUseCase } from './ModifyUserUseCase';
import { CommonUserService } from '../common/CommonUserService';
import { UserModel } from '../../../models/UserModel';
import { CommonUserResponseDto } from '../common/CommonUserResponseDto';
import { ImageModel } from '../../../models/ImageModel';
import { ImageProvider } from '../../../providers/ImageProvider';

@Injectable()
export class ModifyUserUseCaseImpl implements ModifyUserUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
  ) {}

  public async execute({
    id,
    username,
    age,
    statusMessage,
    goal,
  }: ModifyUserUsecaseParams): ModifyUserResponse {
    const user: UserModel = await this._userRepository.findOne(id);

    CommonUserService.assertUserExistence(user);

    const updateUserDto: UpdateUserDto = this._convertParamsToUpdateDto(
      age,
      goal,
      statusMessage,
      username,
    );

    const modifiedUser: UserModel = await this._userRepository.update(
      id,
      updateUserDto,
    );

    const existingAvatar: ImageModel = user['avatar_id'];

    const avatarUrl = await this._getAvatarUrl(existingAvatar);

    const output: CommonUserResponseDto = this._mapModelToResponseDto(
      modifiedUser,
      avatarUrl,
    );

    return output;
  }

  private _mapModelToResponseDto(
    modifiedUser: UserModel,
    avatar: any,
  ): CommonUserResponseDto {
    return {
      username: modifiedUser['username'],
      age: modifiedUser['age'],
      goal: modifiedUser['goal'],
      statusMessage: modifiedUser['status_message'],
      avatar,
      point: modifiedUser['point'],
      exp: modifiedUser['exp'],
      didRoutinesInTotal: modifiedUser['did_routines_in_total'],
      didRoutinesInMonth: modifiedUser['did_routines_in_month'],
      level: modifiedUser['level'],
    };
  }

  private async _getAvatarUrl(profile: ImageModel) {
    const profileModel = this._imageProvider.mapDocumentToImageModel(profile);

    return await this._imageProvider.requestImageToCloudfront(profileModel);
  }

  private _convertParamsToUpdateDto(
    age: number,
    goal: string,
    statusMessage: string,
    username: string,
  ): UpdateUserDto {
    return {
      age,
      goal,
      status_message: statusMessage,
      username,
    };
  }
}
