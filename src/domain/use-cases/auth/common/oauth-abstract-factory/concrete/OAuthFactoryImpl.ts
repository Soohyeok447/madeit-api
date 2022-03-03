import { GoogleAuthProvider } from "../../../../../providers/GoogleAuthProvider";
import { HttpClient } from "../../../../../providers/HttpClient";
import { InvalidProviderException } from "../../../validate/exceptions/InvalidProviderException";
import { OAuth } from "../OAuth";
import { OAuthFactory } from "../OAuthFactory";
import { GoogleOAuth } from "./GoogleOAuth";
import { KakaoOAuth } from "./KakaoOAuth";

export class OAuthFactoryImpl implements OAuthFactory {
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _googleAuthProvider: GoogleAuthProvider,
  ){}
  
  createOAuth(
    thirdPartyAccessToken: string,
    provider: string
  ): OAuth {
    switch (provider) {
      case 'google': {
        return new GoogleOAuth(
          thirdPartyAccessToken,
          this._googleAuthProvider
        );
      }
      case 'kakao': {
        return new KakaoOAuth(
          thirdPartyAccessToken,
          this._httpClient
        );
      }
      default: throw new InvalidProviderException();
    }
  }
}