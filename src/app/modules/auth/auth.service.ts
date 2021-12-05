import { Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialInput } from './dto/auth_credential.dto';
import { UserRepository } from '../users/users.repository';
import { PasswordUnauthorizedException } from '../../common/exceptions/auth/password_unauthorized.exception';
import { UserNotFoundException } from '../../common/exceptions/users/user_not_found.exception';
import { hash } from '../../../app/common/util/util';
import { AuthService } from './interfaces/auth.service';
import { GoogleOauthOutput } from './dto/google_oauth.dto';
import { GoogleUserProfile } from '../../common/types/google_sign_in.type';
import { EmailNotVerifiedException } from 'src/app/common/exceptions/auth/email_not_verified.exception';

@Injectable()
export class AuthServiceImpl extends AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  public async signIn({ email, password }: AuthCredentialInput) {
    const user = await this.userRepository.findOneByEmail(email)

    this.assertUserExistence(user);

    await this.assertPassword(password, user.password);

    const accessToken: string = this.createNewAccessToken(email, user.id);
    const refreshToken: string = this.createNewRefreshToken(email, user.id);

    const hashedRefreshToken = await hash(refreshToken);

    //로그인한 유저의 DB에 refreshToken갱신
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken };
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

  private async assertPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatch = await bcrypt.compare(plainTextPassword, hashedPassword);

    if (!isPasswordMatch) {
      throw new PasswordUnauthorizedException();
    }
  }

  public async googleSignIn() {
    
  }
}
