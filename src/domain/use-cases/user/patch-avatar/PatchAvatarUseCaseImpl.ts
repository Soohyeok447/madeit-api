import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../common/enums/ImageType';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';
import { UserModel } from '../../../../domain/models/UserModel';
import {
  CloudKey,
  ImageProvider,
} from '../../../../domain/providers/ImageProvider';
import { CreateImageDto } from '../../../../domain/repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../../domain/repositories/image/ImageRepository';
import { UpdateUserDto } from '../../../../domain/repositories/user/dtos/UpdateUserDto';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { ImageModel } from '../../../models/ImageModel';
import { UpdateImageDto } from '../../../repositories/image/dtos/UpdateImageDto';
import { PatchAvatarResponse } from '../response.index';
import { CommonUserService } from '../common/CommonUserService';
import { PatchAvatarUseCaseParams } from './dtos/PatchAvatarUseCaseParams';
import { PatchAvatarUseCase } from './PatchAvatarUseCase';
import { CommonUserResponseDto } from '../common/CommonUserResponseDto';

@Injectable()
export class PatchAvatarUseCaseImpl implements PatchAvatarUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
  ) {}

  private _defaultAvatarDto: CreateImageDto = {
    type: ImageType.avatar,
    reference_model: ReferenceModel.User,
    cloud_keys: ['avatar/default'],
  };

  async execute({ id, avatar }: PatchAvatarUseCaseParams): PatchAvatarResponse {
    const existingUser: UserModel = await this._userRepository.findOne(id);

    CommonUserService.assertUserExistence(existingUser);

    // 기존 avatar
    const existingAvatar: ImageModel = existingUser['avatar_id'];

    // 기존 아바타가 기본 아바타인데 기본 아바타로 바꾸려고 함
    if (existingAvatar['cloud_keys'][0].split('/')[1] === 'default') {
      if (!avatar) return await this._mapUserModelToResponseDto(existingUser);
    }

    // 기존 아바타가 사용자 지정 아바타면 클라우드에 있던 기존 아바타 삭제
    existingAvatar['cloud_keys'][0].split('/')[1] !== 'default'
      ? await this._deleteImageFileFromCloudByImageModel(existingAvatar)
      : null;

    // 수정을 할 아바타가 사용자 지정 아바타면 클라우드에 저장
    const avatarCloudKey: CloudKey = avatar
      ? this._imageProvider.putImageFileToCloudDb(avatar, ImageType.avatar)
      : null;

    // imageRepository에 저장할 새로운 createImageDto 생성
    const updateAvatarDto: UpdateImageDto = avatarCloudKey
      ? this._imageProvider.mapCreateImageDtoByCloudKey(
          [`${avatarCloudKey}`],
          ImageType.avatar,
          ReferenceModel.User,
          id,
        )
      : this._defaultAvatarDto;

    // imageRepository에 새이미지로 업데이트 (default아바타, 사용자 지정 아바타)
    const updatedAvatar: ImageModel = await this._imageRepository.update(
      existingAvatar['_id'],
      updateAvatarDto,
    );

    //userRepository에 avatar_id 수정하기 위한 updateUserDto
    const updateUserDtoModifiedAvatar: UpdateUserDto = {
      avatar_id: updatedAvatar['_id'],
    };

    // 아바타를 수정한 user
    const updatedUser: UserModel = await this._userRepository.update(
      id,
      updateUserDtoModifiedAvatar,
    );

    // mapping
    const output: CommonUserResponseDto = await this._mapUserModelToResponseDto(
      updatedUser,
    );

    return output;
  }

  private async _getAvatarUrl(avatar: ImageModel): Promise<string> {
    const url = await this._imageProvider.requestImageToCDN(avatar);

    return url.toString();
  }

  private async _mapUserModelToResponseDto(
    userModel: UserModel,
  ): Promise<CommonUserResponseDto> {
    const avatarUrl: string = await this._getAvatarUrl(userModel['avatar_id']);

    return {
      username: userModel['username'],
      age: userModel['age'],
      goal: userModel['goal'],
      statusMessage: userModel['status_message'],
      avatar: avatarUrl,
      point: userModel['point'],
      exp: userModel['exp'],
      didRoutinesInTotal: userModel['did_routines_in_total'],
      didRoutinesInMonth: userModel['did_routines_in_month'],
      level: userModel['level'],
    };
  }

  private async _deleteImageFileFromCloudByImageModel(
    imageModel: ImageModel,
  ): Promise<void> {
    const originProfileModel =
      this._imageProvider.getMappedImageModel(imageModel);

    this._imageProvider.deleteImageFileFromCloudDb(
      originProfileModel.cloudKeys[0],
    );
  }
}
