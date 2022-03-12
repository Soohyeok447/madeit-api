import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../common/enums/ImageType';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';
import { UserModel } from '../../../../domain/models/UserModel';
import { ImageProvider } from '../../../../domain/providers/ImageProvider';
import { CreateImageDto } from '../../../../domain/repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../../domain/repositories/image/ImageRepository';
import { UpdateUserDto } from '../../../../domain/repositories/user/dtos/UpdateUserDto';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { ImageModel } from '../../../models/ImageModel';
import { UpdateImageDto } from '../../../repositories/image/dtos/UpdateImageDto';
import { PatchAvatarResponse } from '../response.index';
import { CommonUserService } from '../common/CommonUserService';
import { PatchAvatarUseCaseParams } from './dtos/PatchAvatarUseCaseParams';
import { PutProfileAvatarObjectError } from './errors/PutProfileAvatarObjectError';
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
    key: 'profile',
    filenames: ['default'],
  };

  async execute({ id, avatar }: PatchAvatarUseCaseParams): PatchAvatarResponse {
    const existingUser: UserModel = await this._userRepository.findOne(id);

    CommonUserService.assertUserExistence(existingUser);

    // 기존 avatar
    const existingAvatar: ImageModel = existingUser['avatar_id'];

    // 기존 아바타가 기본 아바타인데 기본 아바타로 바꾸려고 함
    if (existingAvatar.filenames[0] === 'default') {
      if (!avatar) return await this._mapUserModelToResponseDto(existingUser);
    }

    // 기존 아바타가 사용자 지정 아바타면 S3에 있던 기존 아바타 삭제
    existingAvatar.filenames[0] !== 'default'
      ? await this._deleteS3ImageObject(existingAvatar)
      : null;

    // 수정을 할 아바타가 사용자 지정 아바타면 S3에 저장
    const newAvatarS3Object = avatar ? await this._putAvatarToS3(avatar) : null;

    // imageRepository에 저장할 새로운 createImageDto 생성
    const updateAvatarDto: UpdateImageDto = newAvatarS3Object
      ? this._imageProvider.mapCreateImageDtoByS3Object(
          newAvatarS3Object,
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

    //userRepository에 avatar_id 수정
    const userDtoWithUpdatedAvatar: UpdateUserDto = {
      avatar_id: updatedAvatar['_id'],
    };

    const modifiedUser: UserModel = await this._userRepository.update(
      id,
      userDtoWithUpdatedAvatar,
    );

    // mapping
    const output: CommonUserResponseDto = await this._mapUserModelToResponseDto(
      modifiedUser,
    );

    return output;
  }

  /**
   * @returntype S3.PutObjectOutput
   */
  private _putAvatarToS3(avatar: Express.Multer.File) {
    try {
      return this._imageProvider.putImageToS3(avatar, ImageType.avatar);
    } catch (err) {
      throw new PutProfileAvatarObjectError();
    }
  }

  private async _getAvatarUrl(avatar: ImageModel): Promise<string> {
    const avatarModel: ImageModel =
      this._imageProvider.mapDocumentToImageModel(avatar);

    const url = await this._imageProvider.requestImageToCloudfront(avatarModel);

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

  private async _deleteS3ImageObject(imageModel: ImageModel): Promise<void> {
    const originProfileModel =
      this._imageProvider.mapDocumentToImageModel(imageModel);

    this._imageProvider.deleteImageFromS3(
      originProfileModel.key,
      originProfileModel.filenames[0],
    );
  }
}
