import { OAuth } from "./OAuth";

export abstract class OAuthFactory {
  abstract createOAuth(thirdPartyAccessToken: string, provider: string): OAuth
}