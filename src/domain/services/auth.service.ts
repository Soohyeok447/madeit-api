import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './interfaces/auth.service';
import { UserNotFoundException } from '../exceptions/users/user_not_found.exception';
import { GoogleEmailNotVerifiedException } from 'src/domain/exceptions/auth/google/google_email_not_verified.exception';
import { GoogleAuthInput } from '../dto/auth/google_auth.input';
import { ReissueAccessTokenInput } from 'src/domain/dto/auth/reissue_accesstoken.input';
import { ReissueAccessTokenOutput } from 'src/domain/dto/auth/reissue_accesstoken.output';
import { GoogleAuthOutput } from 'src/domain/dto/auth/google_auth.output';
import { UserRepository } from '../repositories/users.repository';
import { User } from '../models/user.model';
import { compare, hash } from 'src/infrastructure/utils/hash';
import { HttpClient } from '../../infrastructure/utils/http_client/interface/http_client';
import { KakaoAuthInput } from '../dto/auth/kakao_auth.input';
import { KakaoAuthOutput } from '../dto/auth/kakao_auth.output';
import { KakaoServerException } from '../exceptions/auth/kakao/kakao_server_exception';
import { KakaoInvalidTokenException } from '../exceptions/auth/kakao/kakao_invalid_token.exception';
import { KakaoExpiredTokenException } from '../exceptions/auth/kakao/kakao_expired_token.exception';
import { GoogleInvalidTokenException } from '../exceptions/auth/google/google_invalid_token.exception';
import { Job } from '../models/enum/job.enum';
import { Gender } from '../models/enum/gender.enum';
import { Role } from '../models/enum/role.enum';
import { CreateUserDto } from '../repositories/dto/user/create.dto';

// 미래에 idToken을 받게 되는경우 리팩토링을 위해 주석처리
// import { LoginTicket, OAuth2Client, TokenInfo, TokenPayload } from 'google-auth-library';

@Injectable()
export class AuthServiceImpl extends AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly httpClient: HttpClient,
  ) {
    super();
  }

  public async test(input: any) {}

  public async signInWithGoogleAccessToken({
    googleAccessToken,
  }: GoogleAuthInput): Promise<GoogleAuthOutput> {
    let response;

    const url = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${googleAccessToken}`;

    try {
      response = await this.httpClient.get(url);
    } catch (err) {
      if (err.response.status == 408) {
        throw new RequestTimeoutException();
      }

      if (err.response.data.error == 'invalid_token') {
        throw new GoogleInvalidTokenException();
      }
    }
    const payload = response.data;

    const { email, verified_email, user_id } = payload;
    const userId = user_id;

    if (!verified_email) {
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

  public async signInWithKakaoAccessToken({
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

    const { id } = response.data;
    const userId = id.toString();

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
