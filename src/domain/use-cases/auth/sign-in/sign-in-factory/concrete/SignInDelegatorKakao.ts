import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { UserModel } from '../../../../../models/UserModel';
import { HttpClient } from '../../../../../providers/HttpClient';
import { UpdateUserDto } from '../../../../../repositories/user/dtos/UpdateUserDto';
import { UserRepository } from '../../../../../repositories/user/UserRepository';
import { CommonAuthService } from '../../../service/CommonAuthService';
import { SignInResponseDto } from '../../dtos/SignInResponseDto';
import { KakaoExpiredTokenException } from '../../exceptions/kakao/KakaoExpiredTokenException';
import { KakaoInvalidTokenException } from '../../exceptions/kakao/KakaoInvalidTokenException';
import { KakaoServerException } from '../../exceptions/kakao/KakaoServerException';
import { payload, SignInDelegator, userId } from '../SignInDelegator';

export class SignInDelegatorKakao extends SignInDelegator {
  constructor(
    private _token: string,
    private readonly _userRepository: UserRepository,
    private _httpClient: HttpClient,
    private _authService: CommonAuthService,
  ) {
    super();
  }

  async verifyToken(): Promise<payload> {
    let response;

    const url = `https://kapi.kakao.com/v1/user/access_token_info`;

    const headers = {
      Authorization: `Bearer ${this._token}`,
    };

    try {
      response = await this._httpClient.get(url, headers);
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
      if (
        err.response.data.code == -401 &&
        err.response.data.msg == 'this access token does not exist'
      ) {
        throw new KakaoInvalidTokenException();
      }
      if (
        err.response.data.code == -401 &&
        err.response.data.msg == 'this access token is already expired'
      ) {
        throw new KakaoExpiredTokenException();
      }

      throw err.response.data;
    }

    return response.data;
  }

  async getUserIdByPayload(payload): Promise<userId> {
    const { id, appId } = payload;

    //assert Issuer
    if (appId != process.env.KAKAO_APP_ID) {
      throw new KakaoInvalidTokenException();
    }

    const userId = id.toString();

    return userId;
  }

  async createOrFindUserByExistence(userId: string): Promise<UserModel> {
    let user: UserModel = await this._userRepository.findOneByUserId(userId);

    if (!user) {
      user = await this._authService.createTemporaryUser({
        userId,
        provider: 'kakao',
      });
    } else if (user['deleted_at']) {
      const { deleted_at: _, updated_at: __, ...others }: any = user;

      await this._userRepository.deleteCompletely(user['user_id']);
      await this._userRepository.create(others);
    }

    return user;
  }

  async issueToken(user: UserModel): Promise<SignInResponseDto> {
    return await this._authService.issueAccessTokenAndRefreshToken(user);
  }
}
