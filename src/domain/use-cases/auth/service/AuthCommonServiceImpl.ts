import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserNotFoundException } from "../../../../domain/common/exceptions/UserNotFoundException";
import { Role } from "../../../../domain/enums/Role";
import { UserModel } from "../../../../domain/models/UserModel";
import { CreateUserDto } from "../../../../domain/repositories/user/dtos/CreateUserDto";
import { UserRepository } from "../../../../domain/repositories/user/UserRepository";
import { AuthCommonService } from "./AuthCommonService";


@Injectable()
export class AuthCommonServiceImpl implements AuthCommonService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _jwtService: JwtService,
  ) { }

  public async createTemporaryUser({
    userId,
    provider,
  }: {
    userId: string;
    provider: string;
  }) {
    const temporaryUser: CreateUserDto = {
      provider,
      user_id: userId,
      roles: Role.customer,
      is_admin: false,
    };

    return await this._userRepository.create(temporaryUser);
  }

  public async issueAccessTokenAndRefreshToken(user: UserModel) {
    const { refreshToken, accessToken } = this.createTokenPairs(user["_id"]);

    await this._userRepository.updateRefreshToken(user['_id'], refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  public createTokenPairs(id: string) {
    const accessToken: string = this.createNewAccessToken(id);

    const refreshToken: string = this.createNewRefreshToken(id);

    return { refreshToken, accessToken };
  }

  public createNewRefreshToken(id: string): string {
    return this._jwtService.sign(
      { id },
      {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
        issuer: `${process.env.JWT_ISSUER}`,
      },
    );
  }

  public createNewAccessToken(id: string): string {
    return this._jwtService.sign(
      { id },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
        issuer: `${process.env.JWT_ISSUER}`,
      },
    );
  }

  public assertUserExistence(user): void {
    if (!user) {
      throw new UserNotFoundException();
    }
  }

}