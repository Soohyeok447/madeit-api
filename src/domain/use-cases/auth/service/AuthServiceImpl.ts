import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './interface/AuthService';
import { GoogleAuthInput } from '../sign-in/dtos/google_auth.input';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { HttpClient } from '../../../providers/HttpClient';
import { GoogleInvalidTokenException } from '../sign-in/exceptions/google/GoogleInvalidTokenException';
import { Role } from '../../../enums/Role';
import { CreateUserDto } from '../../../repositories/user/dtos/CreateUserDto';
import { SignInUsecaseDto } from '../sign-in/dtos/SignInUsecaseDto';
import { InvalidProviderException } from '../sign-in/exceptions/InvalidProviderException';
import { KakaoInvalidTokenException } from '../sign-in/exceptions/kakao/KakaoInvalidTokenException';
import { KakaoExpiredTokenException } from '../sign-in/exceptions/kakao/KakaoExpiredTokenException';
import { KakaoServerException } from '../sign-in/exceptions/kakao/KakaoServerException';
import { GoogleAuthOutput } from '../sign-in/dtos/google_auth.output';
import { SignInResponseDto } from '../sign-in/dtos/SignInResponseDto';
import { KakaoAuthInput } from '../sign-in/dtos/kakao_auth.input';
import { KakaoAuthOutput } from '../sign-in/dtos/kakao_auth.output';
import { GoogleEmailNotVerifiedException } from '../sign-in/exceptions/google/GoogleEmailNotVerifiedException';
import { UserNotFoundException } from '../../../common/exceptions/UserNotFoundException';
import { HashProvider } from '../../../providers/HashProvider';
import { GoogleAuthProvider } from '../../../providers/GoogleAuthProvider';
import { UserModel } from '../../../models/UserModel';
import { ReissueAccessTokenResponse, SignInResonse, SignOutResponse } from '../response.index';
import { SignOutUseCaseParams } from '../sign-out/dtos/SignOutUseCaseParams';
import { ReissueAccessTokenUsecaseDto } from '../reissue-access-token/dtos/ReissueAccessTokenUsecaseDto';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _jwtService: JwtService,
    private readonly _httpClient: HttpClient,
    private readonly _hashProvider: HashProvider,
    private readonly _googleAuthProvider: GoogleAuthProvider,
  ) {}

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

  public async signIn({
    thirdPartyAccessToken,
    provider,
  }: SignInUsecaseDto): SignInResonse {
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

  public async signOut({userId}: SignOutUseCaseParams): SignOutResponse {
    const user = await this._userRepository.findOne(userId);

    this._assertUserExistence(user);

    //로그인한 유저의 DB에 refreshToken갱신
    await this._userRepository.updateRefreshToken(user['_id'], null);
  }

  public async reissueAccessToken({
    refreshToken,
    id,
  }: ReissueAccessTokenUsecaseDto): ReissueAccessTokenResponse {
    const user = await this._userRepository.findOne(id);
    this._assertUserExistence(user);

    const result: boolean = await this._hashProvider.compare(
      refreshToken,
      user['refresh_token'],
    );

    if (result) {
      const newAccessToken = this._createNewAccessToken(user['_id']);

      return {
        accessToken: newAccessToken,
      };
    }

    return null;
  }

  private _assertUserExistence(user) {
    if (!user) {
      throw new UserNotFoundException();
    }
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
