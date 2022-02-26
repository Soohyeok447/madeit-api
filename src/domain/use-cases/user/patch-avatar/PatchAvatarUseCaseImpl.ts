import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../../domain/enums/ImageType';
import { ReferenceModel } from '../../../../domain/enums/ReferenceModel';
import { UserModel } from '../../../../domain/models/UserModel';
import { ImageProvider } from '../../../../domain/providers/ImageProvider';
import { CreateImageDto } from '../../../../domain/repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../../domain/repositories/image/ImageRepository';
import { UpdateUserDto } from '../../../../domain/repositories/user/dtos/UpdateUserDto';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { PatchAvatarResponse } from '../response.index';
import { PatchAvatarUseCaseParams } from './dtos/PatchAvatarUseCaseParams';
import { PutProfileAvatarObjectError } from './errors/PutProfileAvatarObjectError';
import { PatchAvatarUseCase } from './PatchAvatarUseCase';

@Injectable()
export class PatchAvatarUseCaseImpl implements PatchAvatarUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
  ) {}

  async execute({ id, avatar }: PatchAvatarUseCaseParams): PatchAvatarResponse {
    const user: UserModel = await this._userRepository.findOne(id);

    const originProfile = user['avatar_id'] ?? null;

    if (originProfile) {
      const originProfileModel =
        this._imageProvider.mapDocumentToImageModel(originProfile);

      await this._imageRepository.delete(originProfile);

      this._imageProvider.deleteImageFromS3(
        originProfileModel.key,
        originProfileModel.filenames[0],
      );
    }

    if (!avatar) {
      const onboardingData: UpdateUserDto = {
        avatar_id: null,
      };

      await this._userRepository.update(id, onboardingData);

      return;
    }

    let profileId: string = null;
    let newProfileS3Object;

    try {
      newProfileS3Object = this._imageProvider.putImageToS3(
        avatar,
        ImageType.userProfile,
      );
    } catch (err) {
      throw new PutProfileAvatarObjectError();
    }

    const newImageData: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByS3Object(
        newProfileS3Object,
        ImageType.userProfile,
        ReferenceModel.User,
        id,
      );

    const createdImage = await this._imageRepository.create(newImageData);

    profileId = createdImage['_id'];

    const onboardingData: UpdateUserDto = {
      avatar_id: profileId,
    };

    await this._userRepository.update(id, onboardingData);
  }
}
