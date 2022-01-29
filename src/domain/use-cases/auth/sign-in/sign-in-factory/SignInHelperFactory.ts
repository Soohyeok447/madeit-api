import { SignInHelper } from "./SignInHelper";

export abstract class SignInHelperFactory {
  abstract makeHelper(provider: string, token: string): SignInHelper;
}