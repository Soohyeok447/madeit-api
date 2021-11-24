import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialDto } from './dto/auth_credential.dto';
import { UserRepository } from '../users/users.repository';
import { PasswordUnauthorizedException } from '../../common/exceptions/auth/password_unauthorized.exception';
import { UserNotFoundException } from '../../common/exceptions/users/user_not_found.exception';
import { hash } from '../../../app/common/util/util';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  public async signIn({ email, password }: AuthCredentialDto) {
    const user = await this.userRepository.findOneByEmail(email)

    this.checkUserExistence(user);

    await this.assertPassword(password, user.password);

    const accessToken: string = this.createNewAccessToken(email);
    const refreshToken: string = this.createNewRefreshToken(email);

    const hashedRefreshToken = await hash(refreshToken);

    //로그인한 유저의 DB에 refreshToken갱신
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken };
  }

  public async signOut(id: string) {
    const user = await this.userRepository.findOne(id);

    this.checkUserExistence(user);

    //로그인한 유저의 DB에 refreshToken갱신
    await this.userRepository.updateRefreshToken(user.id, null);
  }

  public async reissueAccessToken(refreshToken: string, id: string) {
    const user = await this.userRepository.findOne(id);

    this.checkUserExistence(user);

    const result: boolean = await bcrypt.compare(refreshToken, user.refreshToken);

    if (result) {
      const newAccessToken = this.createNewAccessToken(user.email);

      return {
        accessToken: newAccessToken
      }
    }

    return null;
  }

  private checkUserExistence(user: User) {
    if (!user) {
      throw new UserNotFoundException();
    }
  }

  private createNewRefreshToken(email: string): string {
    return this.jwtService.sign({ email }, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
    });
  }

  private createNewAccessToken(email: string): string {
    return this.jwtService.sign({ email }, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
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
}
