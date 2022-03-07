import { GoogleAuthProvider } from '../../../../../providers/GoogleAuthProvider';
import { GoogleEmailNotVerifiedException } from '../../exceptions/google/GoogleEmailNotVerifiedException';
import { GoogleInvalidTokenException } from '../../exceptions/google/GoogleInvalidTokenException';
import { OAuth, payload } from '../OAuth';

export class GoogleOAuth implements OAuth {
  constructor(
    private readonly _token: string,
    private readonly _googleAuthProvider: GoogleAuthProvider,
  ) {}

  async verifyToken(): Promise<payload> {
    return await this._googleAuthProvider.getPayload(this._token);
  }

  async getUserIdByPayload(payload: payload): Promise<string> {
    const { email_verified, sub, azp } = payload;

    //assert 3rd party token Issuer
    if (azp != process.env.GOOGLE_CLIENT_ID_ANDROID) {
      throw new GoogleInvalidTokenException();
    }

    if (!email_verified) {
      throw new GoogleEmailNotVerifiedException();
    }

    const userId = sub;

    return userId;
  }
}
