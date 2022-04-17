import { RequestTimeoutException } from '@nestjs/common';
import { HttpClient, HttpResponse } from '../../../domain/providers/HttpClient';
import { KakaoExpiredTokenException } from '../../../domain/use-cases/auth/common/exceptions/kakao/KakaoExpiredTokenException';
import { InvalidKakaoTokenException } from '../../../domain/use-cases/auth/common/exceptions/kakao/KakaoInvalidTokenException';
import { KakaoServerException } from '../../../domain/use-cases/auth/common/exceptions/kakao/KakaoServerException';
import {
  OAuthProvider,
  payload,
} from '../../../domain/providers/OAuthProvider';
import { LoggerProvider } from '../../../domain/providers/LoggerProvider';

export class KakaoOAuthProvider implements OAuthProvider {
  public constructor(
    private readonly _httpClient: HttpClient,
    private readonly _logger: LoggerProvider,
  ) {}

  public async getPayloadByToken(token: string): Promise<payload> {
    // eslint-disable-next-line @typescript-eslint/typedef
    const url = 'https://kapi.kakao.com/v1/user/access_token_info';

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    const response: HttpResponse = await this._callKakaoApi(url, headers);

    return response.data;
  }

  private async _callKakaoApi(
    url: string,
    headers: Record<string, string>,
  ): Promise<HttpResponse> {
    try {
      return await this._httpClient.get(url, headers);
    } catch (err) {
      if (err.response.status === 408) {
        throw new RequestTimeoutException();
      }
      if (err.response.data.code === -1) {
        throw new KakaoServerException(
          this._logger.getContext(),
          `카카오 내부 서버 에러`,
        );
      }
      if (err.response.data.code === -2) {
        throw new InvalidKakaoTokenException(
          this._logger.getContext(),
          `유효하지 않은 kakao token으로 API를 호출`,
        );
      }
      if (
        err.response.data.code === -401 &&
        err.response.data.msg === 'this access token does not exist'
      ) {
        throw new InvalidKakaoTokenException(
          this._logger.getContext(),
          `유효하지 않은 kakao token으로 API를 호출`,
        );
      }
      if (
        err.response.data.code === -401 &&
        err.response.data.msg === 'this access token is already expired'
      ) {
        throw new KakaoExpiredTokenException(
          this._logger.getContext(),
          `만료된 kakao token으로 API를 호출`,
        );
      }

      throw err.response.data;
    }
  }

  public async getUserIdByPayload(payload: payload): Promise<string> {
    const { id, appId } = payload;

    //assert 3rd party token Issuer
    if (appId.toString() !== process.env.KAKAO_APP_ID) {
      throw new InvalidKakaoTokenException(
        this._logger.getContext(),
        `madeit에서 발급한 kakao token이 아닌 kakao token으로 API를 호출`,
      );
    }

    const userId: string = id.toString();

    return userId;
  }
}
