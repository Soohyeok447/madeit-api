import { Injectable, Req, RequestTimeoutException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosResponse } from 'axios'; //TODO http client 의존하도록 수정
import * as bcrypt from 'bcrypt'; //TODO util로 메서드 빼고 의존성 제거하도록 수정
import { AuthService } from '../../adapter/services/auth.service';
import { UserNotFoundException } from '../../adapter/exceptions/users/user_not_found.exception';
import { InvalidTokenException } from 'src/adapter/exceptions/auth/invalid_token.exception';
import { ExpiredTokenException } from 'src/adapter/exceptions/auth/expired_token.exception';
import { EmailNotVerifiedException } from 'src/adapter/exceptions/auth/email_not_verified.exception';
import { GoogleAuthInput } from '../dto/auth/google_auth.input';
import { ReissueAccessTokenInput } from 'src/domain/dto/auth/reissue_accesstoken.input';
import { ReissueAccessTokenOutput } from 'src/domain/dto/auth/reissue_accesstoken.output';
import { GoogleAuthOutput } from 'src/domain/dto/auth/google_auth.output';
import { UserRepository } from '../repositories/users.repository';
import { UserModel } from '../models/user.model';

// 미래에 idToken을 받게 되는경우 리팩토링을 위해 주석처리 
// import { LoginTicket, OAuth2Client, TokenInfo, TokenPayload } from 'google-auth-library';

@Injectable()
export class AuthServiceImpl extends AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  public async googleAuth({ googleAccessToken }: GoogleAuthInput): Promise<GoogleAuthOutput> {
    let response: AxiosResponse

    try {
      response = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${googleAccessToken}`);
    } catch (err) {
      if (err.response.status == 408) {
        throw new RequestTimeoutException();
      }

      if (err.response.data.error == 'invalid_token') {
        throw new InvalidTokenException();
      }
    }
    const payload = response.data;

    const { email, verified_email } = payload;

    if (!verified_email) {
      throw new EmailNotVerifiedException();
    }

    const foundUser = await this.userRepository.findOneByEmail(email);

    this.assertUserExistence(foundUser);

    const { refreshToken, accessToken } = this.createTokenPairs(email, foundUser);

    await this.userRepository.updateRefreshToken(foundUser.id, refreshToken);

    return {
      accessToken,
      refreshToken
    }
  }

  private createTokenPairs(email: string, foundUser: UserModel) {
    const accessToken: string = this.createNewAccessToken(email, foundUser.id);

    const refreshToken: string = this.createNewRefreshToken(email, foundUser.id);

    return { refreshToken, accessToken };
  }

  public async signOut(id: number): Promise<void> {
    const user = await this.userRepository.findOne(id);

    this.assertUserExistence(user);

    //로그인한 유저의 DB에 refreshToken갱신
    await this.userRepository.updateRefreshToken(user.id, null);
  }

  public async reissueAccessToken({ refreshToken, id }: ReissueAccessTokenInput): Promise<ReissueAccessTokenOutput> {
    const user = await this.userRepository.findOne(id);

    this.assertUserExistence(user);

    const result: boolean = await bcrypt.compare(refreshToken, user.refreshToken); //TODO hash util로 빼고 util 의존하도록 수정

    if (result) {
      const newAccessToken = this.createNewAccessToken(user.email, user.id);

      return {
        accessToken: newAccessToken
      }
    }

    return null;
  }

  private assertUserExistence(user) {
    if (!user) {
      throw new UserNotFoundException();
    }
  }

  private createNewRefreshToken(email: string, id: number): string {
    return this.jwtService.sign({ email, id }, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
      issuer: `${process.env.JWT_ISSUER}`
    });
  }

  private createNewAccessToken(email: string, id: number): string {
    return this.jwtService.sign({ email, id }, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
      issuer: `${process.env.JWT_ISSUER}`
    });
  }
}