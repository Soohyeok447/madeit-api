import { Injectable } from "@nestjs/common";
import { GoogleAuthProvider } from "../../../../../providers/GoogleAuthProvider";
import { HttpClient } from "../../../../../providers/HttpClient";
import { InvalidProviderException } from "../../exceptions/InvalidProviderException";
import { Provider } from "../../types/provider";
import { OAuth } from "../OAuth";
import { OAuthFactory } from "../OAuthFactory";
import { GoogleOAuth } from "./GoogleOAuth";
import { KakaoOAuth } from "./KakaoOAuth";

@Injectable()
export class OAuthFactoryImpl implements OAuthFactory {
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _googleAuthProvider: GoogleAuthProvider,
  ){}
  
  createOAuth(
    thirdPartyAccessToken: string,
    provider: Provider
  ): OAuth {
    switch (provider) {
      case Provider.google: {
        return new GoogleOAuth(
          thirdPartyAccessToken,
          this._googleAuthProvider
        );
      }
      case Provider.kakao: {
        return new KakaoOAuth(
          thirdPartyAccessToken,
          this._httpClient
        );
      }
      default: throw new InvalidProviderException();
    }
  }
}