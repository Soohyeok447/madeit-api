import { GoogleEmailNotVerifiedException } from '../../../domain/use-cases/auth/common/exceptions/google/GoogleEmailNotVerifiedException';
import { GoogleInvalidTokenException } from '../../../domain/use-cases/auth/common/exceptions/google/GoogleInvalidTokenException';
import {
  OAuthProvider,
  payload,
} from '../../../domain/providers/OAuthProvider';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';

export class GoogleOAuthProvider implements OAuthProvider {
  public async getPayloadByToken(token: string): Promise<payload> {
    const googleClient: OAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
    );

    const googlePayload: TokenPayload = await this._getTokenPayload(
      googleClient,
      token,
    );

    const payload: payload = {
      sub: googlePayload['sub'],
      azp: googlePayload['azp'],
      email_verified: googlePayload['email_verified'],
    };

    return payload;
  }

  public async getUserIdByPayload(payload: payload): Promise<string> {
    const { email_verified, sub, azp } = payload;

    //assert 3rd party token Issuer
    if (azp != process.env.GOOGLE_CLIENT_ID_ANDROID) {
      throw new GoogleInvalidTokenException();
    }

    if (!email_verified) {
      throw new GoogleEmailNotVerifiedException();
    }

    const userId: string = sub;

    return userId;
  }

  private async _getTokenPayload(
    client: OAuth2Client,
    token: string,
  ): Promise<TokenPayload> {
    try {
      const ticket: LoginTicket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      return ticket.getPayload(); //토큰 변조, 만료까지 검증하는 메서드
    } catch (err) {
      throw new GoogleInvalidTokenException();
    }
  }
}
