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
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class PatchAvatarUseCaseImpl implements PatchAvatarUseCase {
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  private _defaultAvatarDto: CreateImageDto = {
    type: ImageType.avatar,
    reference_model: ReferenceModel.User,
    cloud_keys: ['avatar/default'],
  };

  public async execute({
    id,
    avatar,
  }: PatchAvatarUseCaseParams): PatchAvatarResponse {
    this._logger.setContext('PatchAvatar');

    const user: User = await this._userRepository.findOne(id);

    if (!user) {
      this._logger.error(
        `미가입 유저가 이미지 수정 API 호출. 호출자 id - ${id}`,
      );

      throw new UserNotFoundException();
    }

    const existingAvatar: ImageModel = await this._imageRepository.findOne(
      user.avatarId,
    );

    // 기존 아바타가 기본 아바타인데 기본 아바타로 바꾸려고 함
    if (existingAvatar['cloud_keys'][0].split('/')[1] === 'default') {
      if (!avatar) {
        const avatarUrl: string | string[] =
          await this._imageProvider.requestImageToCDN(user.avatarId);

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
          avatar: avatarUrl as string,
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
      user.avatarId,
      updateAvatarDto,
    );

    //userRepository에 avatar_id 수정하기 위한 updateUserDto
    const updateUserDtoModifiedAvatar: UpdateUserDto = {
      avatarId: updatedAvatar['_id'],
    };

    // 아바타를 수정한 user
    const updatedUser: User = await this._userRepository.update(
      id,
      updateUserDtoModifiedAvatar,
    );

    const avatarUrl: string | string[] =
      await this._imageProvider.requestImageToCDN(updatedUser.avatarId);

    return {
      username: updatedUser.username,
      age: updatedUser.age,
      goal: updatedUser.goal,
      statusMessage: updatedUser.statusMessage,
      avatar: avatarUrl as string,
      point: updatedUser.point,
      exp: updatedUser.exp,
      didRoutinesInTotal: updatedUser.didRoutinesInTotal,
      didRoutinesInMonth: updatedUser.didRoutinesInMonth,
      level: updatedUser.level,
    };
  }

  private async _deleteImageFileFromCloudByImageModel(
    imageModel: any,
  ): Promise<void> {
    const originProfileModel: ImageModel =
      this._imageProvider.getMappedImageModel(imageModel);

    this._imageProvider.deleteImageFileFromCloudDb(
      originProfileModel.cloudKeys[0],
    );
  }
}
