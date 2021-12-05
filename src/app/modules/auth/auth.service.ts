import { Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialInput } from './dto/auth_credential.dto';
import { UserRepository } from '../users/users.repository';
import { PasswordUnauthorizedException } from '../../common/exceptions/auth/password_unauthorized.exception';
import { UserNotFoundException } from '../../common/exceptions/users/user_not_found.exception';
import { hash } from '../../../app/common/util/util';
import { AuthService } from './interfaces/auth.service';
import { GoogleOauthInput, GoogleOauthOutput } from './dto/google_oauth.dto';
import axios, { AxiosResponse } from 'axios';
import { InvalidTokenException } from 'src/app/common/exceptions/auth/invalid_token.exception';
import { ExpiredTokenException } from 'src/app/common/exceptions/auth/expired_token.exception';
import { EmailNotVerifiedException } from 'src/app/common/exceptions/auth/email_not_verified.exception';
// import { LoginTicket, OAuth2Client, TokenInfo, TokenPayload } from 'google-auth-library';

@Injectable()
export class AuthServiceImpl extends AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {
    super();
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

  public googleAuth(googleOauthInput: GoogleOauthInput) {
    throw new Error('Method not implemented.');
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