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
import { UsernameConflictException } from '../../user/validate-username/exceptions/UsernameConflictException';
import { OAuthProviderFactory } from '../../../providers/OAuthProviderFactory';
import { SignUpResponse } from '../response.index';
import { SignUpUseCaseParams } from './dtos/SignUpUseCaseParams';
import { UserAlreadyRegisteredException } from './exceptions/UserAlreadyRegisteredException';
import { SignUpUseCase } from './SignUpUseCase';
import { OAuthProvider, payload } from '../../../providers/OAuthProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { InvalidUsernameException } from './exceptions/InvalidUsernameException';

@Injectable()
export class SignUpUseCaseImpl implements SignUpUseCase {
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _oAuthProviderFactory: OAuthProviderFactory,
    private readonly _jwtProvider: JwtProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    provider,
    thirdPartyAccessToken,
    username,
    age,
    goal,
    statusMessage,
  }: SignUpUseCaseParams): SignUpResponse {
    this._logger.setContext('SignUp');

    const oAuthProvider: OAuthProvider =
      this._oAuthProviderFactory.create(provider);

    const payload: payload = await oAuthProvider.getPayloadByToken(
      thirdPartyAccessToken,
    );

    const userId: string = await oAuthProvider.getUserIdByPayload(payload);

    const existingUser: User = await this._userRepository.findOneByUserId(
      userId,
    );

    if (existingUser) {
      throw new UserAlreadyRegisteredException(
        this._logger.getContext(),
        `이미 가입한 유저가 회원가입 API를 호출. 호출자 id - ${existingUser.id}`,
      );
    }

    const duplicatedUsername: User =
      await this._userRepository.findOneByUsername(username);

    if (duplicatedUsername) {
      throw new UsernameConflictException(
        this._logger.getContext(),
        `중복된 닉네임으로 회원가입 API를 호출. 호출자 id - ${duplicatedUsername.id}`,
      );
    }

    const isValid: boolean = UserUtils.validateUsername(username);

    if (!isValid) {
      throw new InvalidUsernameException(
        this._logger.getContext(),
        `중복된 닉네임으로 회원가입 API를 호출. 호출자 id - ${duplicatedUsername.id}`,
      );
    }

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
      avatarId: defaultAvatar.id,
    });

    const avatarCDN: string | string[] =
      await this._imageProvider.requestImageToCDN(defaultAvatar['_id']);

    const accessToken: string = this._jwtProvider.signAccessToken(newUser.id);

    const refreshToken: string = this._jwtProvider.signRefreshToken(newUser.id);

    await this._userRepository.updateRefreshToken(newUser.id, refreshToken);

    this._logger.info(`${newUser.id} 가 신규가입.`);

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
