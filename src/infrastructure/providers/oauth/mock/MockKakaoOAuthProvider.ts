/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestTimeoutException } from '@nestjs/common';
import {
  HttpClient,
  HttpResponse,
} from '../../../../domain/providers/HttpClient';
import { KakaoExpiredTokenException } from '../../../../domain/use-cases/auth/common/exceptions/kakao/KakaoExpiredTokenException';
import { InvalidKakaoTokenException } from '../../../../domain/use-cases/auth/common/exceptions/kakao/KakaoInvalidTokenException';
import { KakaoServerException } from '../../../../domain/use-cases/auth/common/exceptions/kakao/KakaoServerException';
import {
  OAuthProvider,
  payload,
} from '../../../../domain/providers/OAuthProvider';
import { InvalidTokenIssuerException } from '../../../../domain/common/exceptions/customs/InvalidTokenException';

export class MockKakaoOAuthProvider implements OAuthProvider {
  public constructor(private readonly _httpClient: HttpClient) {}

  public async getPayloadByToken(token: string): Promise<payload> {
    if (token === 'wrongToken') throw new InvalidKakaoTokenException();

    return {
      id: 'mockedId',
      appId: 'mockedAppId',
      email_verified: true,
      azp: 'mockedAzp',
      sub: 'mockedSub',
    };
  }

  public async getUserIdByPayload(payload: payload): Promise<string> {
    return 'userId';
  }
}
