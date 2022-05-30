import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../common/enums/ImageType';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';
import { ImageProvider } from '../../../../domain/providers/ImageProvider';
import { CreateImageDto } from '../../../../domain/repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../../domain/repositories/image/ImageRepository';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { ImageModel } from '../../../models/ImageModel';
import { PatchAvatarResponse } from '../response.index';
import { PatchAvatarUseCaseParams } from './dtos/PatchAvatarUseCaseParams';
import { PatchAvatarUseCase } from './PatchAvatarUseCase';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { CompleteRoutineRepository } from '../../../repositories/complete-routine/CompleteRoutineRepository';
import { MomentProvider } from '../../../providers/MomentProvider';

@Injectable()
export class PatchAvatarUseCaseImpl implements PatchAvatarUseCase {
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _completeRoutineRepository: CompleteRoutineRepository,
    private readonly _momentProvider: MomentProvider,
    private readonly _logger: LoggerProvider,
  ) {}

  private _defaultAvatarDto: CreateImageDto = {
    type: ImageType.avatar,
    reference_model: ReferenceModel.User,
    cloud_keys: ['avatar/default'],
  };

  public async execute({ id }: PatchAvatarUseCaseParams): PatchAvatarResponse {
    this._logger.setContext('PatchAvatar');

    const user: User = await this._userRepository.findOne(id);

    if (!user) {
      throw new UserNotFoundException(
        this._logger.getContext(),
        `미가입 유저가 이미지 수정 API 호출.`,
      );
    }

    const existingAvatar: ImageModel = await this._imageRepository.findOne(
      user.avatarId,
    );

    // 기존 아바타가 사용자 지정 아바타면 클라우드에 있던 기존 아바타 삭제
    existingAvatar['cloud_keys'][0].split('/')[1] !== 'default' &&
      (await this._deleteImageFileFromCloudByImageModel(existingAvatar));

    // 수정을 할 아바타가 사용자 지정 아바타면 클라우드에 저장
    // const avatarCloudKey: CloudKey =
    //   avatarId &&
    //   this._imageProvider.putImageFileToCloudDb(Buffer, ImageType.avatar);

    // // imageRepository에 저장할 새로운 createImageDto 생성
    // const updateAvatarDto: UpdateImageDto = avatarCloudKey
    //   ? this._imageProvider.mapCreateImageDtoByCloudKey(
    //       ['asdf'],
    //       ImageType.avatar,
    //       ReferenceModel.User,
    //       id,
    //     )
    //   : this._defaultAvatarDto;

    // imageRepository에 새이미지로 업데이트 (default아바타, 사용자 지정 아바타)
    // const updatedAvatar: ImageModel = await this._imageRepository.update(
    //   user.avatarId,
    //   updateAvatarDto,
    // );

    //userRepository에 avatar_id 수정하기 위한 updateUserDto
    // const updateUserDtoModifiedAvatar: UpdateUserDto = {
    //   avatarId: updatedAvatar['_id'],
    // };

    // 아바타를 수정한 user
    // const updatedUser: User = await this._userRepository.update(
    //   id,
    //   updateUserDtoModifiedAvatar,
    // );

    // const avatarUrl: string | string[] =
    //   await this._imageProvider.requestImageToCDN(updatedUser.avatarId);

    // const completeRoutines: CompleteRoutine[] =
    //   await this._completeRoutineRepository.findAllByUserId(user.id);

    // const didRoutinesInMonth: number =
    //   this._momentProvider.getCountOfRoutinesCompletedInThisMonth(
    //     completeRoutines,
    //   );

    return;
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
