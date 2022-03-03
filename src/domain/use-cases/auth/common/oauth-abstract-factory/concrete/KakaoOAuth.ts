import { RequestTimeoutException } from "@nestjs/common";
import { HttpClient } from "../../../../../providers/HttpClient";
import { KakaoExpiredTokenException } from "../../../validate/exceptions/kakao/KakaoExpiredTokenException";
import { KakaoInvalidTokenException } from "../../../validate/exceptions/kakao/KakaoInvalidTokenException";
import { KakaoServerException } from "../../../validate/exceptions/kakao/KakaoServerException";
import { OAuth, payload } from "../OAuth";

export class KakaoOAuth implements OAuth {
  constructor(
    private readonly _token: string,
    private readonly _httpClient: HttpClient,
  ) { }


  async verifyToken(): Promise<payload> {
    const url = `https://kapi.kakao.com/v1/user/access_token_info`;

    const headers = {
      Authorization: `Bearer ${this._token}`,
    };

    const response = await this._callKakaoApi(url, headers);

    return response.data;
  }

  private async _callKakaoApi(url: string, headers: { Authorization: string }) {
    try {
      return await this._httpClient.get(url, headers);
    } catch (err) {
      if (err.response.status == 408) {
        throw new RequestTimeoutException();
      }
      if (err.response.data.code == -1) {
        throw new KakaoServerException();
      }
      if (err.response.data.code == -2) {
        throw new KakaoInvalidTokenException();
      }
      if (err.response.data.code == -401 &&
        err.response.data.msg == 'this access token does not exist') {
        throw new KakaoInvalidTokenException();
      }
      if (err.response.data.code == -401 &&
        err.response.data.msg == 'this access token is already expired') {
        throw new KakaoExpiredTokenException();
      }

      throw err.response.data;
    }
  }

  async getUserIdByPayload(payload: payload): Promise<string> {
    const { id, appId } = payload;

    //assert 3rd party token Issuer
    if (appId != process.env.KAKAO_APP_ID) {
      throw new KakaoInvalidTokenException();
    }

    const userId = id.toString();

    return userId;
  }

}