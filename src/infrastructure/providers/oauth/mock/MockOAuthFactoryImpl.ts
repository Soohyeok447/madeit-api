import { Injectable } from '@nestjs/common';
import { HttpClient } from '../../../../domain/providers/HttpClient';
import { InvalidProviderException } from '../../../../domain/use-cases/auth/common/exceptions/InvalidProviderException';
import { Provider } from '../../../../domain/use-cases/auth/common/types/provider';
import { OAuthProvider } from '../../../../domain/providers/OAuthProvider';
import { OAuthProviderFactory } from '../../../../domain/providers/OAuthProviderFactory';
import { GoogleOAuthProvider } from './../GoogleOAuthProvider';
import { MockKakaoOAuthProvider } from './MockKakaoOAuthProvider';
import { LoggerProvider } from '../../../../domain/providers/LoggerProvider';

@Injectable()
export class MockOAuthFactoryImpl implements OAuthProviderFactory {
  public constructor(
    private readonly _httpClient: HttpClient,
    private readonly _logger: LoggerProvider,
  ) {}

  public create(provider: Provider): OAuthProvider {
    switch (provider) {
      case Provider.google: {
        return new GoogleOAuthProvider(this._logger);
      }
      case Provider.kakao: {
        return new MockKakaoOAuthProvider(this._httpClient);
      }
      default:
        throw new InvalidProviderException();
    }
  }
}
