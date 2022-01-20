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
import { Resolution } from 'src/domain/common/enums/resolution.enum';

@Injectable()
export class UsersServiceImpl implements UsersService {
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

    const profileModel = this.imageProvider.mapDocumentToImageModel(user['profile_id']);

    const profile = await this.imageProvider.requestImageToCloudfront(resolution, profileModel);

    const output: FindUserOutput = {
      profile,
      ...user,
    };

    return output;
  }

  public async modifyUser({ id, profile, username, birth, job, gender, }: ModifyUserInput): Promise<void> {
    //TODO imageProvider로 빼야할 부분
    console.log(profile);

    const s3Keys = profile['key'].split('/');
    const imageType = s3Keys[1];
    const filename = s3Keys[2];

    const imageData: CreateImageDto = {
      type: ImageType.userProfile,
      reference_id: id,
      reference_model: ReferenceId.User,
      key: `${imageType}`,
      filenames: [filename]
    }
    
    const resultImage = await this.imageRepository.create(imageData);
    const imageId = resultImage['_id'];
    //TODO imageId를 return 해야함 

    const assertUserResult = await this.userRespository.findOneByUsername(username);

    if (assertUserResult) {
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
      profile_id: imageId
    };

    await this.userRespository.update(id, onboardingData);
  }
}