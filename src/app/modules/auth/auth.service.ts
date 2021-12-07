import { Injectable, Req, RequestTimeoutException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../users/users.repository';
import { UserNotFoundException } from '../../common/exceptions/users/user_not_found.exception';
import { hash } from '../../../app/common/util/util';
import { AuthService } from './interfaces/auth.service';
import { GoogleOauthInput, GoogleOauthOutput } from './dto/google_oauth.dto';
import axios, { AxiosResponse } from 'axios';
import { InvalidTokenException } from 'src/app/common/exceptions/auth/invalid_token.exception';
import { ExpiredTokenException } from 'src/app/common/exceptions/auth/expired_token.exception';
import { EmailNotVerifiedException } from 'src/app/common/exceptions/auth/email_not_verified.exception';
import { User } from '../users/entities/user.entity';

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

  public async googleAuth({ googleAccessToken }: GoogleOauthInput) {
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

    await this.updateHashedRefreshToken(refreshToken, foundUser);

    return {
      accessToken,
      refreshToken
    }
  }

  private async updateHashedRefreshToken(refreshToken: string, foundUser: User) {
    const hashedRefreshToken = await hash(refreshToken);

    //로그인한 유저의 DB에 refreshToken갱신
    await this.userRepository.updateRefreshToken(foundUser.id, hashedRefreshToken);
  }

  private createTokenPairs(email: string, foundUser: User) {
    const accessToken: string = this.createNewAccessToken(email, foundUser.id);

    const refreshToken: string = this.createNewRefreshToken(email, foundUser.id);

    return { refreshToken, accessToken };
  }

  public async signOut(id: string) {
    const user = await this.userRepository.findOne(id);

    this.assertUserExistence(user);

    //로그인한 유저의 DB에 refreshToken갱신
    await this.userRepository.updateRefreshToken(user.id, null);
  }

  public async reissueAccessToken(refreshToken: string, id: number) {
    const user = await this.userRepository.findOne(id);

    this.assertUserExistence(user);

    const result: boolean = await bcrypt.compare(refreshToken, user.refreshToken);

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