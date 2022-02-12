import { GoogleAuthProvider } from '../../domain/providers/GoogleAuthProvider';
import { OAuth2Client } from 'google-auth-library';

export class GoogleAuthProviderImpl implements GoogleAuthProvider {
  getGoogleClient(googleClientId: string) {
    return new OAuth2Client(googleClientId);
  }
}
