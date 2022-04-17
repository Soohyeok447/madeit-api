import { Injectable } from '@nestjs/common';
import { HttpClient } from '../../../domain/providers/HttpClient';
import { InvalidProviderException } from '../../../domain/use-cases/auth/common/exceptions/InvalidProviderException';
import { Provider } from '../../../domain/use-cases/auth/common/types/provider';
import { OAuthProvider } from '../../../domain/providers/OAuthProvider';
import { OAuthProviderFactory } from '../../../domain/providers/OAuthProviderFactory';
import { GoogleOAuthProvider } from './GoogleOAuthProvider';
import { KakaoOAuthProvider } from './KakaoOAuthProvider';
import { LoggerProvider } from '../../../domain/providers/LoggerProvider';

@Injectable()
export class OAuthFactoryImpl implements OAuthProviderFactory {
  public constructor(
    private readonly _httpClient: HttpClient,
    private readonly _logger: LoggerProvider,
  ) {
    // this._logger.setContext('OAuthFactoryImpl');
  }

  public create(provider: Provider): OAuthProvider {
    switch (provider) {
      case Provider.google: {
        return new GoogleOAuthProvider(this._logger);
      }
      case Provider.kakao: {
        return new KakaoOAuthProvider(this._httpClient, this._logger);
      }
      default:
        throw new InvalidProviderException(
          this._logger.getContext(),
          `유효하지 않은 provider인 ${provider}로 Authentication API 호출`,
        );
    }
  }
}
