import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './interface/auth.service';
import { UserNotFoundException } from '../../common/exceptions/user_not_found.exception';
import { GoogleEmailNotVerifiedException } from 'src/domain/auth/use-cases/integrated-sign-in/exceptions/google/google_email_not_verified.exception';
import { GoogleAuthInput } from '../use-cases/integrated-sign-in/dtos/google_auth.input';
import { UserRepository } from '../../users/users.repository';
import { User } from '../../users/user.model';
import { compare, hash } from 'src/infrastructure/utils/hash';
import { HttpClient } from '../../../infrastructure/utils/http_client/interface/http_client';
import { GoogleInvalidTokenException } from '../use-cases/integrated-sign-in/exceptions/google/google_invalid_token.exception';
import { Role } from '../../common/enums/role.enum';
import { CreateUserDto } from '../../users/common/dtos/create.dto';
import { SignInInput } from '../use-cases/integrated-sign-in/dtos/signin.input';
import { InvalidProviderException } from '../use-cases/integrated-sign-in/exceptions/invalid_provider.exception';

import { OAuth2Client } from 'google-auth-library';
import { KakaoInvalidTokenException } from '../use-cases/integrated-sign-in/exceptions/kakao/kakao_invalid_token.exception';
import { KakaoExpiredTokenException } from '../use-cases/integrated-sign-in/exceptions/kakao/kakao_expired_token.exception';
import { KakaoServerException } from '../use-cases/integrated-sign-in/exceptions/kakao/kakao_server_exception';
import { GoogleAuthOutput } from '../use-cases/integrated-sign-in/dtos/google_auth.output';
import { SignInOutput } from '../use-cases/integrated-sign-in/dtos/signin.output';
import { KakaoAuthInput } from '../use-cases/integrated-sign-in/dtos/kakao_auth.input';
import { KakaoAuthOutput } from '../use-cases/integrated-sign-in/dtos/kakao_auth.output';
import { ReissueAccessTokenOutput } from '../use-cases/reissue-access-token/dtos/reissue_accesstoken.output';
import { ReissueAccessTokenInput } from '../use-cases/reissue-access-token/dtos/reissue_accesstoken.input';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly httpClient: HttpClient,
  ) {}

  public async test(input: any) {
    return await this.userRepository.findAll();
  }

  private async signInWithGoogleAccessToken({
    googleAccessToken,
  }: GoogleAuthInput): Promise<GoogleAuthOutput> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT);

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

    let user: User;

    user = await this.userRepository.findOneByUserId(userId);

    if (!user) {
      user = await this.createTemporaryUser({
        userId,
        email,
        provider: 'google',
      });
    }

    return await this.issueAccessTokenAndRefreshToken(user);
  }

  private async signInWithKakaoAccessToken({
    kakaoAccessToken,
  }: KakaoAuthInput): Promise<KakaoAuthOutput> {
    let response;

    const url = `https://kapi.kakao.com/v1/user/access_token_info`;

    const headers = {
      Authorization: `Bearer ${kakaoAccessToken}`,
    };

    try {
      response = await this.httpClient.get(url, headers);
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

    let user: User;

    user = await this.userRepository.findOneByUserId(userId);

    if (!user) {
      user = await this.createTemporaryUser({
        userId,
        email: '',
        provider: 'kakao',
      });
    }

    return await this.issueAccessTokenAndRefreshToken(user);
  }

  public async integratedSignIn({
    thirdPartyAccessToken,
    provider,
  }: SignInInput): Promise<SignInOutput> {
    switch (provider) {
      case 'kakao': {
        const token: KakaoAuthInput = {
          kakaoAccessToken: thirdPartyAccessToken,
        };

        return this.signInWithKakaoAccessToken(token);
      }

      case 'google': {
        const token: GoogleAuthInput = {
          googleAccessToken: thirdPartyAccessToken,
        };

        return this.signInWithGoogleAccessToken(token);
      }

      default:
        throw new InvalidProviderException();
    }
  }

  private async createTemporaryUser({
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

    return await this.userRepository.create(temporaryUser);
  }

  private async issueAccessTokenAndRefreshToken(user) {
    const { refreshToken, accessToken } = this.createTokenPairs(user._id);

    await this.userRepository.updateRefreshToken(user._id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private createTokenPairs(id: string) {
    const accessToken: string = this.createNewAccessToken(id);

    const refreshToken: string = this.createNewRefreshToken(id);

    return { refreshToken, accessToken };
  }

  public async signOut(id: string): Promise<void> {
    const user = await this.userRepository.findOne(id);

    this.assertUserExistence(user);

    //로그인한 유저의 DB에 refreshToken갱신
    await this.userRepository.updateRefreshToken(user.id, null);
  }

  public async reissueAccessToken({
    refreshToken,
    id,
  }: ReissueAccessTokenInput): Promise<ReissueAccessTokenOutput> {
    const user = await this.userRepository.findOne(id);

    this.assertUserExistence(user);

    const result: boolean = await compare(refreshToken, user.refreshToken);

    if (result) {
      const newAccessToken = this.createNewAccessToken(user.id);

      return {
        accessToken: newAccessToken,
      };
    }

    return null;
  }

  private assertUserExistence(user) {
    if (!user) {
      throw new UserNotFoundException();
    }
  }

  private createNewRefreshToken(id: string): string {
    return this.jwtService.sign(
      { id },
      {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
        issuer: `${process.env.JWT_ISSUER}`,
      },
    );
  }

  private createNewAccessToken(id: string): string {
    return this.jwtService.sign(
      { id },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
        issuer: `${process.env.JWT_ISSUER}`,
      },
    );
  }
}
