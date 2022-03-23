import { Provider } from '../use-cases/auth/common/types/provider';
import { OAuthProvider } from './OAuthProvider';

export abstract class OAuthProviderFactory {
  abstract create(provider: Provider): OAuthProvider;
}
