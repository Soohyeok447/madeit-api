import { Injectable } from "@nestjs/common";
import { GoogleAuthProvider } from "../../../../../../domain/providers/GoogleAuthProvider";
import { HttpClient } from "../../../../../../domain/providers/HttpClient";
import { UserRepository } from "../../../../../../domain/repositories/user/UserRepository";
import { SignInHelperKakao } from "./SignInHelperKakao";
import { SignInHelperGoogle } from "./SignInHelperGoogle";
import { SignInHelper } from "../SignInHelper";
import { SignInHelperFactory } from "../SignInHelperFactory";
import { AuthCommonService } from "../../../service/AuthCommonService";
import { InvalidProviderException } from "../../exceptions/InvalidProviderException";

@Injectable()
export class SignInHelperFactoryImpl implements SignInHelperFactory {
  constructor(
    private readonly _googleAuthProvider: GoogleAuthProvider,
    private readonly _httpClient: HttpClient,
    private readonly _userRepository: UserRepository,
    private readonly _authService: AuthCommonService,
  ) { }

  makeHelper(provider: string, token: string): SignInHelper {
    switch (provider) {
      case 'google':
        return new SignInHelperGoogle(token, this._googleAuthProvider, this._userRepository, this._authService);
      case 'kakao':
        return new SignInHelperKakao(token, this._userRepository, this._httpClient, this._authService);
      default:
        throw new InvalidProviderException();
    }
  }
}