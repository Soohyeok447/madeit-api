import { Injectable } from '@nestjs/common';
import { GoogleAuthProvider } from '../../../../../providers/GoogleAuthProvider';
import { HttpClient } from '../../../../../providers/HttpClient';
import { UserRepository } from '../../../../../repositories/user/UserRepository';
import { SignInDelegatorKakao } from './SignInDelegatorKakao';
import { SignInDelegatorGoogle } from './SignInDelegatorGoogle';
import { SignInDelegator } from '../SignInDelegator';
import { SignInDelegatorFactory } from '../SignInDelegatorFactory';
import { CommonAuthService } from '../../../service/CommonAuthService';
import { InvalidProviderException } from '../../exceptions/InvalidProviderException';

@Injectable()
export class SignInDelegatorFactoryImpl implements SignInDelegatorFactory {
  constructor(
    private readonly _googleAuthProvider: GoogleAuthProvider,
    private readonly _httpClient: HttpClient,
    private readonly _userRepository: UserRepository,
    private readonly _authService: CommonAuthService,
  ) {}

  makeHelper(provider: string, token: string): SignInDelegator {
    switch (provider) {
      case 'google':
        return new SignInDelegatorGoogle(
          token,
          this._googleAuthProvider,
          this._userRepository,
          this._authService,
        );
      case 'kakao':
        return new SignInDelegatorKakao(
          token,
          this._userRepository,
          this._httpClient,
          this._authService,
        );
      default:
        throw new InvalidProviderException();
    }
  }
}
