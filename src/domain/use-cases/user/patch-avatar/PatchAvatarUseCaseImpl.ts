import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../common/enums/ImageType';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';
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
import { PatchAvatarUseCaseParams } from './dtos/PatchAvatarUseCaseParams';
import { PatchAvatarUseCase } from './PatchAvatarUseCase';
import { User } from '../../../entities/User';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';

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
    const user = await this._userRepository.findOne(id);

    if (!user) throw new UserNotFoundException();

    // 기존 avatar
    const existingAvatar = user.avatar;

    // 기존 아바타가 기본 아바타인데 기본 아바타로 바꾸려고 함
    if (existingAvatar['cloud_keys'][0].split('/')[1] === 'default') {
      if (!avatar) {
        const avatarUrl = await this._imageProvider.requestImageToCDN(
          existingAvatar['_id'],
        );

        return {
          username: user.username,
          age: user.age,
          goal: user.goal,
          statusMessage: user.statusMessage,
          point: user.point,
          exp: user.exp,
          didRoutinesInTotal: user.didRoutinesInTotal,
          didRoutinesInMonth: user.didRoutinesInMonth,
          level: user.level,
          avatar: avatarUrl,
        };
      }
    }

    // 기존 아바타가 사용자 지정 아바타면 클라우드에 있던 기존 아바타 삭제
    existingAvatar['cloud_keys'][0].split('/')[1] !== 'default' &&
      (await this._deleteImageFileFromCloudByImageModel(existingAvatar));

    // 수정을 할 아바타가 사용자 지정 아바타면 클라우드에 저장
    const avatarCloudKey: CloudKey =
      avatar &&
      this._imageProvider.putImageFileToCloudDb(avatar, ImageType.avatar);

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
      avatar: updatedAvatar['_id'],
    };

    // 아바타를 수정한 user
    const updatedUser: User = await this._userRepository.update(
      id,
      updateUserDtoModifiedAvatar,
    );

    const avatarUrl = await this._imageProvider.requestImageToCDN(
      updatedAvatar['_id'],
    );

    return {
      username: updatedUser.username,
      age: updatedUser.age,
      goal: updatedUser.goal,
      statusMessage: updatedUser.statusMessage,
      avatar: avatarUrl,
      point: updatedUser.point,
      exp: updatedUser.exp,
      didRoutinesInTotal: updatedUser.didRoutinesInTotal,
      didRoutinesInMonth: updatedUser.didRoutinesInMonth,
      level: updatedUser.level,
    };
  }

  private async _deleteImageFileFromCloudByImageModel(
    imageModel,
  ): Promise<void> {
    const originProfileModel =
      this._imageProvider.getMappedImageModel(imageModel);

    this._imageProvider.deleteImageFileFromCloudDb(
      originProfileModel.cloudKeys[0],
    );
  }
}
