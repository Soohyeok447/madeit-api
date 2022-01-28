import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/domain/repositories/user/UserRepository";
import { SignOutResponse } from "../response.index";
import { AuthService } from "../service/interface/AuthService";
import { SignOutUseCaseParams } from "./dtos/SignOutUseCaseParams";
import { SignOutUseCase } from "./SignOutUseCase";

@Injectable()
export class SignOutUseCaseImpl implements SignOutUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _authService: AuthService,
  ){}

  public async execute({userId}: SignOutUseCaseParams): SignOutResponse {
    const user = await this._userRepository.findOne(userId);

    //TODO this._authService.assertUserExistence(user);

    //로그인한 유저의 DB에 refreshToken갱신
    await this._userRepository.updateRefreshToken(user['_id'], null);
  }
}