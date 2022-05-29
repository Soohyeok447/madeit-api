import { Injectable } from '@nestjs/common';
import { User } from '../../../entities/User';
import { JwtProvider } from '../../../providers/JwtProvider';
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
import { ImageProviderV2 } from '../../../providers/ImageProviderV2';

@Injectable()
export class SignUpUseCaseImplV2 implements SignUpUseCase {
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _oAuthProviderFactory: OAuthProviderFactory,
    private readonly _jwtProvider: JwtProvider,
    private readonly _imageProviderV2: ImageProviderV2,
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

    const avatarUrl: string = this._imageProviderV2.getDefaultAvatarUrl();

    const accessToken: string = this._jwtProvider.signAccessToken(newUser.id);

    const refreshToken: string = this._jwtProvider.signRefreshToken(newUser.id);

    await this._userRepository.updateRefreshToken(newUser.id, refreshToken);

    this._logger.info(`${newUser.id} 가 신규가입.`);

    return {
      accessToken,
      refreshToken,
      avatarUrl,
      username: newUser.username,
      age: newUser.age,
      goal: newUser.goal,
      statusMessage: newUser.statusMessage,
      point: newUser.point,
      exp: newUser.exp,
      didRoutinesInTotal: 0,
      didRoutinesInMonth: 0,
      level: newUser.level,
    };
  }
}
