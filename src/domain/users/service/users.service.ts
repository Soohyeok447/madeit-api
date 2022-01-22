import { Injectable } from '@nestjs/common';
import { UsersService } from './interface/users.service';
import { UserRepository } from '../../common/repositories/user/users.repository';
import { User } from '../../common/models/user.model';
import { UpdateUserDto } from '../../common/repositories/user/dtos/update.dto';
import { UserNotRegisteredException } from '../use-cases/find-user/exceptions/user_not_registered.exception';
import { FindUserInput } from '../use-cases/find-user/dtos/find_user.input';
import { FindUserOutput } from '../use-cases/find-user/dtos/find_user.output';
import { UsernameConflictException } from '../use-cases/do-user-onboarding/exceptions/username_conflict.exception';
import { InvalidUsernameException } from '../use-cases/do-user-onboarding/exceptions/invalid_username.exception';
import { DoUserOnboardingInput } from '../use-cases/do-user-onboarding/dtos/do_user_onboarding.input';
import { ImageRepository } from 'src/domain/common/repositories/image/image.repository';
import { ModifyUserInput } from '../use-cases/modify-user/dtos/modify_user.input';
import { CreateImageDto } from 'src/domain/common/repositories/image/dtos/create.dto';
import { ImageType } from 'src/domain/common/enums/image.enum';
import { ReferenceId } from 'src/domain/common/enums/reference_id.enum';
import { Image } from 'src/domain/common/models/image.model';
import { ImageProvider } from 'src/domain/common/providers/image.provider';

@Injectable()
export class UsersServiceImpl implements UsersService {
  constructor(
    private readonly userRespository: UserRepository,
    private readonly imageRepository: ImageRepository,
    private readonly imageProvider: ImageProvider,
  ) { }

  public async doUserOnboarding({
    id,
    birth,
    gender,
    job,
    username,
  }: DoUserOnboardingInput): Promise<void> {
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

  public async findUser({ id, resolution }: FindUserInput): Promise<FindUserOutput> {
    const user: User = await this.userRespository.findOne(id);

    if (!user.gender || !user.job || !user.username || !user.birth) {
      throw new UserNotRegisteredException();
    }

    const profile: Image = user['profile_id'] ?? null;

    let profileImage;

    if (profile) {
      const profileModel = this.imageProvider.mapDocumentToImageModel(profile);

      profileImage = await this.imageProvider.requestImageToCloudfront(resolution, profileModel);
    }

    const output: FindUserOutput = {
      profileImage,
      ...user,
    };

    return output;
  }

  public async modifyUser({ id, profile, username, birth, job, gender, }: ModifyUserInput): Promise<void> {
    const assertUserResult = await this.userRespository.findOneByUsername(username);

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
        newProfileS3Object = this.imageProvider.putImageToS3(profile, ImageType.userProfile);
      }
      catch (err) {
        throw Error('s3 bucket에 profile origin 이미지 저장 실패');
      }

      const newImageData: CreateImageDto = this.imageProvider.mapCreateImageDtoByS3Object(
        newProfileS3Object,
        ImageType.userProfile,
        ReferenceId.User,
        id
      );

      //새로운 이미지 db에 저장
      const resultImage = await this.imageRepository.create(newImageData);
      profileId = resultImage['_id'];
    }

    const originImageObject = user["profile_id"] ?? null;

    if (originImageObject) {
      const originProfileKey = originImageObject["key"];
      const originProfileFilename = originImageObject["filenames"][0];

      await this.imageRepository.delete(originImageObject);

      this.imageProvider.deleteImageFromS3(originProfileKey, originProfileFilename);
    }

    const onboardingData: UpdateUserDto = {
      birth,
      gender,
      job,
      username,
      profile_id: profileId
    };

    await this.userRespository.update(id, onboardingData);
  }
}