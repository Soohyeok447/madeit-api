import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../common/enums/ImageType';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';
import { User } from '../../../entities/User';
import { ImageModel } from '../../../models/ImageModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { JwtProvider } from '../../../providers/JwtProvider';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { UserUtils } from '../../user/common/UserUtils';
import { InvalidUsernameException } from '../../user/validate-username/exceptions/InvalidUsernameException';
import { UsernameConflictException } from '../../user/validate-username/exceptions/UsernameConflictException';
import { OAuthProviderFactory } from '../../../providers/OAuthProviderFactory';
import { SignUpResponse } from '../response.index';
import { SignUpUseCaseParams } from './dtos/SignUpUseCaseParams';
import { UserAlreadyRegisteredException } from './exceptions/UserAlreadyRegisteredException';
import { SignUpUseCase } from './SignUpUseCase';

@Injectable()
export class SignUpUseCaseImpl implements SignUpUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _oAuthProviderFactory: OAuthProviderFactory,
    private readonly _jwtProvider: JwtProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _imageProvider: ImageProvider,
  ) {}

  public async execute({
    provider,
    thirdPartyAccessToken,
    username,
    age,
    goal,
    statusMessage,
  }: SignUpUseCaseParams): SignUpResponse {
    const oAuthProvider = this._oAuthProviderFactory.create(provider);

    const payload = await oAuthProvider.verifyToken(thirdPartyAccessToken);

    const userId = await oAuthProvider.getUserIdByPayload(payload);

    const existingUser = await this._userRepository.findOneByUserId(userId);

    if (existingUser) throw new UserAlreadyRegisteredException();

    const duplicatedUsername = await this._userRepository.findOneByUsername(
      username,
    );

    if (duplicatedUsername) throw new UsernameConflictException();

    const isValid = UserUtils.validateUsername(username);

    if (!isValid) throw new InvalidUsernameException();

    const newUser: User = await this._userRepository.create({
      userId,
      provider,
      age,
      goal,
      statusMessage,
      username,
    });

    //newUser의 Id를 레퍼런스Id로 사용해서 image객체 ImageRepository에 저장
    const defaultAvatar: ImageModel = await this._imageRepository.create({
      type: ImageType.avatar,
      reference_model: ReferenceModel.User,
      cloud_keys: ['avatar/default'],
      reference_id: newUser.id,
    });

    //userModel의 아바타 레퍼런스 id 업데이트
    await this._userRepository.update(newUser.id, {
      avatar: defaultAvatar.id,
    });

    const avatar = await this._imageRepository.findOne(defaultAvatar.id);

    const avatarCDN = await this._imageProvider.requestImageToCDN(avatar);

    const accessToken = this._jwtProvider.signAccessToken(newUser.id);

    const refreshToken = this._jwtProvider.signRefreshToken(newUser.id);

    await this._userRepository.updateRefreshToken(newUser.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      avatar: avatarCDN as string,
      username: newUser.username,
      age: newUser.age,
      goal: newUser.goal,
      statusMessage: newUser.statusMessage,
      point: newUser.point,
      exp: newUser.exp,
      didRoutinesInTotal: newUser.didRoutinesInTotal,
      didRoutinesInMonth: newUser.didRoutinesInMonth,
      level: newUser.level,
    };
  }
}
