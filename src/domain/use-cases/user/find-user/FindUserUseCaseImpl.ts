import { Injectable } from '@nestjs/common';
import { ImageModel } from '../../../models/ImageModel';
import { UserModel } from '../../../models/UserModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { FindUserResponse } from '../response.index';
import { FindUserResponseDto } from './dtos/FindUserResponseDto';
import { FindUserUsecaseParams } from './dtos/FindUserUsecaseParams';
import { UserNotRegisteredException } from './exceptions/UserNotRegisteredException';
import { FindUserUseCase } from './FindUserUseCase';

@Injectable()
export class FindUserUseCaseImpl implements FindUserUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
  ) { }

  public async execute({ id }: FindUserUsecaseParams): FindUserResponse {
    const user: UserModel = await this._userRepository.findOne(id);

    this._assertUserRegistration(user);

    const profile: ImageModel = user['profile_id'] ?? null;

    const avatar = await this._getAvatarImage(profile);

    const output: FindUserResponseDto = this._mapToResponseDto(avatar, user);

    return output;
  }

  private _assertUserRegistration(user: UserModel) {
    if (!user.age || !user.username) {
      throw new UserNotRegisteredException();
    }
  }

  private async _getAvatarImage(profile: ImageModel) {
    if (profile) {
      const profileModel = this._imageProvider.mapDocumentToImageModel(profile);

      return await this._imageProvider.requestImageToCloudfront(profileModel);
    }
  }

  private _mapToResponseDto(avatar: any, user: UserModel): FindUserResponseDto {
    const {
      _id: _,
      user_id: __,
      is_admin: ___,
      provider: ____,
      created_at: _____,
      refresh_token: ______,
      updated_at: _______,
      status_message: ________,
      profile_id: _________,
      ...others
    }: any = user;

    return {
      avatar,
      statusMessage: user['status_message'],
      ...others,
    };
  }
}
