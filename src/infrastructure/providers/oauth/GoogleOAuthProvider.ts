import { GoogleEmailNotVerifiedException } from '../../../domain/use-cases/auth/common/exceptions/google/GoogleEmailNotVerifiedException';
import { GoogleInvalidTokenException } from '../../../domain/use-cases/auth/common/exceptions/google/GoogleInvalidTokenException';
import {
  OAuthProvider,
  payload,
} from '../../../domain/providers/OAuthProvider';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { Injectable } from '@nestjs/common';
import { LoggerProvider } from '../../../domain/providers/LoggerProvider';

@Injectable()
export class GoogleOAuthProvider implements OAuthProvider {
  public constructor(private readonly _logger: LoggerProvider) {
    // this._logger.setContext('GoogleOAuthProvider');
  }

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
    if (azp !== process.env.GOOGLE_CLIENT_ID_ANDROID) {
      this._logger.error(
        `유효하지않은 google token 발급자. azp(발급자) -> ${azp}`,
      );

      throw new GoogleInvalidTokenException();
    }

    if (!email_verified) {
      this._logger.error(
        `google email이 유효하지 않음. sub(google 고유id) -> ${sub}`,
      );

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
      this._logger.error(`누군가가 유효하지 않은 google token으로 API를 호출`);

      throw new GoogleInvalidTokenException();
    }
  }
}
