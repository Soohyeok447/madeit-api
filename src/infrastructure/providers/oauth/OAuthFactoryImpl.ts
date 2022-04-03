import { Injectable } from '@nestjs/common';
import { HttpClient } from '../../../domain/providers/HttpClient';
import { InvalidProviderException } from '../../../domain/use-cases/auth/common/exceptions/InvalidProviderException';
import { Provider } from '../../../domain/use-cases/auth/common/types/provider';
import { OAuthProvider } from '../../../domain/providers/OAuthProvider';
import { OAuthProviderFactory } from '../../../domain/providers/OAuthProviderFactory';
import { GoogleOAuthProvider } from './GoogleOAuthProvider';
import { KakaoOAuthProvider } from './KakaoOAuthProvider';

@Injectable()
export class OAuthFactoryImpl implements OAuthProviderFactory {
  public constructor(private readonly _httpClient: HttpClient) {}

  public create(provider: Provider): OAuthProvider {
    switch (provider) {
      case Provider.google: {
        return new GoogleOAuthProvider();
      }
      case Provider.kakao: {
        return new KakaoOAuthProvider(this._httpClient);
      }
      default:
        throw new InvalidProviderException();
    }
  }
}
