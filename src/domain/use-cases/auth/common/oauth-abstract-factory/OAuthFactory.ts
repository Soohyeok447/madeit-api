import { Provider } from "../types/provider";
import { OAuth } from "./OAuth";

export abstract class OAuthFactory {
  abstract createOAuth(thirdPartyAccessToken: string, provider: Provider): OAuth
}