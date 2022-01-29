import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../../../domain/enums/Role';
import { UserModel } from '../../../../domain/models/UserModel';
import { GoogleAuthProvider } from '../../../../domain/providers/GoogleAuthProvider';
import { HttpClient } from '../../../../domain/providers/HttpClient';
import { CreateUserDto } from '../../../../domain/repositories/user/dtos/CreateUserDto';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { SignInResonse } from '../response.index';
import { GoogleAuthInput } from './dtos/google_auth.input';
import { GoogleAuthOutput } from './dtos/google_auth.output';
import { KakaoAuthInput } from './dtos/kakao_auth.input';
import { KakaoAuthOutput } from './dtos/kakao_auth.output';
import { SignInUsecaseParams } from './dtos/SignInUsecaseParams';
import { GoogleEmailNotVerifiedException } from './exceptions/google/GoogleEmailNotVerifiedException';
import { GoogleInvalidTokenException } from './exceptions/google/GoogleInvalidTokenException';
import { InvalidProviderException } from './exceptions/InvalidProviderException';
import { KakaoExpiredTokenException } from './exceptions/kakao/KakaoExpiredTokenException';
import { KakaoInvalidTokenException } from './exceptions/kakao/KakaoInvalidTokenException';
import { KakaoServerException } from './exceptions/kakao/KakaoServerException';
import { SignInUseCase } from './SignInuseCase';

@Injectable()
export class SignInUseCaseImpl implements SignInUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _jwtService: JwtService,
    private readonly _googleAuthProvider: GoogleAuthProvider,
    private readonly _httpClient: HttpClient,
  ) {}

  public async execute({
    thirdPartyAccessToken,
    provider,
  }: SignInUsecaseParams): SignInResonse {
    switch (provider) {
      case 'kakao': {
        const token: KakaoAuthInput = {
          kakaoAccessToken: thirdPartyAccessToken,
        };

        return this._signInWithKakaoAccessToken(token);
      }

      case 'google': {
        const token: GoogleAuthInput = {
          googleAccessToken: thirdPartyAccessToken,
        };

        return this._signInWithGoogleAccessToken(token);
      }

      default:
        throw new InvalidProviderException();
    }
  }

  private async _signInWithGoogleAccessToken({
    googleAccessToken,
  }: GoogleAuthInput): Promise<GoogleAuthOutput> {
    const client = this._googleAuthProvider.getGoogleClient(
      process.env.GOOGLE_CLIENT,
    );

    let ticket;
    let payload;

    try {
      ticket = await client.verifyIdToken({
        idToken: googleAccessToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      payload = ticket.getPayload();
    } catch (err) {
      throw new GoogleInvalidTokenException();
    }

    const { email, email_verified, sub, azp } = payload;
    const userId = sub;

    //Issuer assert
    if (azp != process.env.GOOGLE_CLIENT_ID_ANDROID) {
      throw new GoogleInvalidTokenException();
    }

    if (!email_verified) {
      throw new GoogleEmailNotVerifiedException();
    }

    let user: UserModel;

    user = await this._userRepository.findOneByUserId(userId);

    if (!user) {
      user = await this._createTemporaryUser({
        userId,
        email,
        provider: 'google',
      });
    }

    return await this.issueAccessTokenAndRefreshToken(user);
  }

  private async _signInWithKakaoAccessToken({
    kakaoAccessToken,
  }: KakaoAuthInput): Promise<KakaoAuthOutput> {
    let response;

    const url = `https://kapi.kakao.com/v1/user/access_token_info`;

    const headers = {
      Authorization: `Bearer ${kakaoAccessToken}`,
    };

    try {
      response = await this._httpClient.get(url, headers);
    } catch (err) {
      if (err.response.status == 408) {
        throw new RequestTimeoutException();
      }
      if (err.response.data.code == -1) {
        throw new KakaoServerException();
      }
      if (err.response.data.code == -2) {
        throw new KakaoInvalidTokenException();
      }
      if (
        err.response.data.code == -401 &&
        err.response.data.msg == 'this access token does not exist'
      ) {
        throw new KakaoInvalidTokenException();
      }
      if (
        err.response.data.code == -401 &&
        err.response.data.msg == 'this access token is already expired'
      ) {
        throw new KakaoExpiredTokenException();
      }

      throw err.response.data;
    }

    const { id, appId } = response.data;
    const userId = id.toString();

    //Issuer assert
    if (appId != process.env.KAKAO_APP_ID) {
      throw new KakaoInvalidTokenException();
    }

    let user: UserModel;

    user = await this._userRepository.findOneByUserId(userId);

    if (!user) {
      user = await this._createTemporaryUser({
        userId,
        email: '',
        provider: 'kakao',
      });
    }

    return await this.issueAccessTokenAndRefreshToken(user);
  }

  private async _createTemporaryUser({
    userId,
    email,
    provider,
  }: {
    userId: string;
    email: string;
    provider: string;
  }) {
    const temporaryUser: CreateUserDto = {
      provider,
      email,
      user_id: userId,
      roles: Role.customer,
      is_admin: false,
    };

    return await this._userRepository.create(temporaryUser);
  }

  private async issueAccessTokenAndRefreshToken(user) {
    const { refreshToken, accessToken } = this._createTokenPairs(user._id);

    await this._userRepository.updateRefreshToken(user['_id'], refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private _createTokenPairs(id: string) {
    const accessToken: string = this._createNewAccessToken(id);

    const refreshToken: string = this._createNewRefreshToken(id);

    return { refreshToken, accessToken };
  }

  private _createNewRefreshToken(id: string): string {
    return this._jwtService.sign(
      { id },
      {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
        issuer: `${process.env.JWT_ISSUER}`,
      },
    );
  }

  private _createNewAccessToken(id: string): string {
    return this._jwtService.sign(
      { id },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
        issuer: `${process.env.JWT_ISSUER}`,
      },
    );
  }
}
