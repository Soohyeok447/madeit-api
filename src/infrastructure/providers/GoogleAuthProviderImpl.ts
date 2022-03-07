import { GoogleAuthProvider } from '../../domain/providers/GoogleAuthProvider';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { payload } from '../../domain/use-cases/auth/common/oauth-abstract-factory/OAuth';
import { GoogleInvalidTokenException } from '../../domain/use-cases/auth/common/exceptions/google/GoogleInvalidTokenException';

export class GoogleAuthProviderImpl implements GoogleAuthProvider {
  async getPayload(token: string): Promise<payload> {
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
