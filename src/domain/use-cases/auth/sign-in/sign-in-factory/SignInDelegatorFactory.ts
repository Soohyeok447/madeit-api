import { SignInDelegator } from './SignInDelegator';

export abstract class SignInDelegatorFactory {
  abstract makeHelper(provider: string, token: string): SignInDelegator;
}
