import { Injectable } from '@nestjs/common';
import { ImageModel } from '../../../models/ImageModel';
import { UserModel } from '../../../models/UserModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { UseCase } from '../../UseCase';
import { FindUserResponse } from '../response.index';
import { FindUserResponseDto } from './dtos/FindUserResponseDto';
import { FindUserUsecaseParams } from './dtos/FindUserUsecaseParams';
import { UserNotRegisteredException } from './exceptions/UserNotRegisteredException';
import { FindUserUseCase } from './FindUserUseCase';

/**
 * id로 유저를 찾음
 */

@Injectable()
export class FindUserUseCaseImpl implements FindUserUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
  ) { }

  public async execute({
    id,
    resolution,
  }: FindUserUsecaseParams): FindUserResponse {
    const user: UserModel = await this._userRepository.findOne(id);

    if (!user.gender || !user.job || !user.username || !user.birth) {
      throw new UserNotRegisteredException();
    }

    const profile: ImageModel = user['profile_id'] ?? null;

    let profileImage;

    if (profile) {
      const profileModel = this._imageProvider.mapDocumentToImageModel(profile);

      profileImage = await this._imageProvider.requestImageToCloudfront(
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
}
