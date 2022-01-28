import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../enums/ImageType';
import { ReferenceId } from '../../../enums/ReferenceId';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ImageProvider } from '../../../providers/ImageProvider';
import { ModifyUserUsecaseParams } from './dtos/ModifyUserUsecaseParams';
import { UpdateUserDto } from '../../../repositories/user/dtos/UpdateUserDto';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { InvalidUsernameException } from '../do-user-onboarding/exceptions/InvalidUsernameException';
import { UsernameConflictException } from '../do-user-onboarding/exceptions/UsernameConflictException';
import { ModifyUserResponse } from '../response.index';
import { PutProfileImageObjectError } from './errors/PutProfileImageObjectError';
import { ModifyUserUseCase } from './ModifyUserUseCase';

/**
 * 유저 정보 수정
 *
 * 프로필 사진 수정, 삭제 가능
 */
@Injectable()
export class ModifyUserUseCaseImpl
  implements ModifyUserUseCase
{
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageRepository: ImageRepository,
    private readonly _imageProvider: ImageProvider,
  ) { }

  public async execute({
    id,
    profile,
    username,
    birth,
    job,
    gender,
  }: ModifyUserUsecaseParams): ModifyUserResponse {
    const assertUserResult = await this._userRepository.findOneByUsername(
      username,
    );

    if (assertUserResult) {
      throw new UsernameConflictException();
    }

    if (username.length < 2 || username.length > 8) {
      throw new InvalidUsernameException();
    }

    const user = await this._userRepository.findOne(id);

    let profileId: string = null;
    let newProfileS3Object;

    if (profile) {
      try {
        newProfileS3Object = this._imageProvider.putImageToS3(
          profile,
          ImageType.userProfile,
        );
      } catch (err) {
        throw new PutProfileImageObjectError();
      }

      const newImageData: CreateImageDto =
        this._imageProvider.mapCreateImageDtoByS3Object(
          newProfileS3Object,
          ImageType.userProfile,
          ReferenceId.User,
          id,
        );

      //새로운 이미지 db에 저장
      const createdImage = await this._imageRepository.create(newImageData);
      profileId = createdImage['_id'];
    }

    const originProfileObject = user['profile_id'] ?? null;

    if (originProfileObject) {
      const originProfileModel =
        this._imageProvider.mapDocumentToImageModel(originProfileObject);

      await this._imageRepository.delete(originProfileObject);

      this._imageProvider.deleteImageFromS3(
        originProfileModel.key,
        originProfileModel.filenames[0],
      );
    }

    const onboardingData: UpdateUserDto = {
      birth,
      gender,
      job,
      username,
      profile_id: profileId,
    };

    await this._userRepository.update(id, onboardingData);
  }
}
