import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialDto } from './dto/auth_credential.dto';
import { UserRepository } from '../users/users.repository';
import { PasswordUnauthorizedException } from '../../common/exceptions/auth/password_unauthorized.exception';
import { UserNotFoundException } from '../../common/exceptions/users/user_not_found.exception';
import { hash } from '../../../app/common/util/util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  public async signIn({ email, password }: AuthCredentialDto) {

    const user = await this.userRepository.findOneByEmail(email)

    if (!user) {
      throw new UserNotFoundException();
    }

    await this.assertPassword(password, user.password);

    const accessToken: string = this.createNewAccessToken(email);
    const refreshToken: string = this.createNewRefreshToken(email);

    const hashedRefreshToken = await hash(refreshToken);

    //로그인한 유저의 DB에 refreshToken갱신
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken };

  }

  public async signOut(email: string){
    const user = await this.userRepository.findOneByEmail(email);

    //로그인한 유저의 DB에 refreshToken갱신
    const result = await this.userRepository.updateRefreshToken(user.id, null);

    if (result === null) {
      return {
        message: 'succeed to update refreshToken to null',
        status: 'success',
      }
    }

    return {
      message: 'failed to update refreshToken',
      status: 'failed'
    }
  }

  // /**
  //  * Authorization header에 있는 refreshToken값을 대비해서 성공 여부를 리턴합니다. 
  //  * 
  //  * */
  // private async matchRefreshToken(refreshToken: string, email: string){
  //   const user = await this.userRepository.findOneByEmail(email)

  //   const result = await bcrypt.compare(refreshToken, user.refreshToken);

  //   return result;
  // }



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
