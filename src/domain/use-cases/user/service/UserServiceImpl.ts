import { Injectable } from '@nestjs/common';
import { UserService } from './interface/UserService';
import { UserNotRegisteredException } from '../use-cases/find-user/exceptions/UserNotRegisteredException';
import { FindUserUsecaseDto } from '../use-cases/find-user/dtos/FindUserUsecaseDto';
import { FindUserResponseDto } from '../use-cases/find-user/dtos/FindUserResponseDto';
import { UsernameConflictException } from '../use-cases/do-user-onboarding/exceptions/UsernameConflictException';
import { InvalidUsernameException } from '../use-cases/do-user-onboarding/exceptions/InvalidUsernameException';
import { DoUserOnboardingUsecaseDto } from '../use-cases/do-user-onboarding/dtos/DoUserOnboardingUsecaseDto';
import { ModifyUserUsecaseDto } from '../use-cases/modify-user/dtos/ModifyUserUsecaseDto';
import { ImageType } from '../../../enums/ImageType';
import { ReferenceId } from '../../../enums/ReferenceId';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { ImageProvider } from '../../../providers/ImageProvider';
import { UpdateUserDto } from '../../../repositories/user/dtos/UpdateUserDto';
import { UserModel } from '../../../models/UserModel';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { ImageModel } from '../../../models/ImageModel';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    private readonly userRespository: UserRepository,
    private readonly imageRepository: ImageRepository,
    private readonly imageProvider: ImageProvider,
  ) {}

  public async doUserOnboarding({
    id,
    birth,
    gender,
    job,
    username,
  }: DoUserOnboardingUsecaseDto): Promise<void> {
    const assertResult = await this.userRespository.findOneByUsername(username);

    if (assertResult) {
      throw new UsernameConflictException();
    }

    if (username.length < 2 || username.length > 8) {
      throw new InvalidUsernameException();
    }

    const onboardingData: UpdateUserDto = {
      birth,
      gender,
      job,
      username,
    };

    await this.userRespository.update(id, onboardingData);
  }

  public async findUser({
    id,
    resolution,
  }: FindUserUsecaseDto): Promise<FindUserResponseDto> {
    const user: UserModel = await this.userRespository.findOne(id);

    if (!user.gender || !user.job || !user.username || !user.birth) {
      throw new UserNotRegisteredException();
    }

    const profile: ImageModel = user['profile_id'] ?? null;

    let profileImage;

    if (profile) {
      const profileModel = this.imageProvider.mapDocumentToImageModel(profile);

      profileImage = await this.imageProvider.requestImageToCloudfront(
        resolution,
        profileModel,
      );
    }

    const output: FindUserResponseDto = {
      profileImage,
      ...user,
    };

    return output;
  }

  public async modifyUser({
    id,
    profile,
    username,
    birth,
    job,
    gender,
  }: ModifyUserUsecaseDto): Promise<void> {
    const assertUserResult = await this.userRespository.findOneByUsername(
      username,
    );

    if (assertUserResult) {
      throw new UsernameConflictException();
    }

    if (username.length < 2 || username.length > 8) {
      throw new InvalidUsernameException();
    }

    const user = await this.userRespository.findOne(id);

    let profileId: string = null;
    let newProfileS3Object;

    if (profile) {
      try {
        newProfileS3Object = this.imageProvider.putImageToS3(
          profile,
          ImageType.userProfile,
        );
      } catch (err) {
        throw Error('s3 bucket에 profile origin 이미지 저장 실패');
      }

      const newImageData: CreateImageDto =
        this.imageProvider.mapCreateImageDtoByS3Object(
          newProfileS3Object,
          ImageType.userProfile,
          ReferenceId.User,
          id,
        );

      //새로운 이미지 db에 저장
      const createdImage = await this.imageRepository.create(newImageData);
      profileId = createdImage['_id'];
    }

    const originProfileObject = user['profile_id'] ?? null;

    if (originProfileObject) {
      const originProfileModel =
        this.imageProvider.mapDocumentToImageModel(originProfileObject);

      await this.imageRepository.delete(originProfileObject);

      this.imageProvider.deleteImageFromS3(
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

    await this.userRespository.update(id, onboardingData);
  }
}
