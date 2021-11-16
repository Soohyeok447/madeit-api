import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialDto } from './dto/auth_credential.dto';
import { UserRepository } from '../users/users.repository';
import { PasswordUnauthorizedException } from '../../common/exceptions/auth/password_unauthorized.exception';
import { UserNotFoundException } from '../../common/exceptions/users/user_not_found.exception';
import { hash } from '../../../app/common/util/util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  public async signIn(authCredentialDto: AuthCredentialDto) {
    try {
      const { email, password } = authCredentialDto;
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
    } catch (err) {
      throw err;
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
    try {
      const isPasswordMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
      
      if (!isPasswordMatch) {
        throw new PasswordUnauthorizedException();
      }
    } catch (err) {
      throw err;
    }
  }
}
