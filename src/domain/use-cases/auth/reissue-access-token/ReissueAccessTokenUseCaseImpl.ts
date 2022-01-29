import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserNotFoundException } from '../../../../domain/common/exceptions/UserNotFoundException';
import { HashProvider } from '../../../../domain/providers/HashProvider';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { ReissueAccessTokenResponse } from '../response.index';
import { AuthCommonService } from '../service/AuthCommonService';
import { ReissueAccessTokenUsecaseParams } from './dtos/ReissueAccessTokenUsecaseParams';
import { ReissueAccessTokenUseCase } from './ReissueAccessTokenUseCase';

@Injectable()
export class ReissueAccessTokenUseCaseImpl
  implements ReissueAccessTokenUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _hashProvider: HashProvider,
    private readonly _authService: AuthCommonService,
  ) { }

  public async execute({
    refreshToken,
    id,
  }: ReissueAccessTokenUsecaseParams): ReissueAccessTokenResponse {
    const user = await this._userRepository.findOne(id);
    this._authService.assertUserExistence(user);

    const result: boolean = await this._hashProvider.compare(
      refreshToken,
      user['refresh_token'],
    );

    if (!result) {
      return null;
    }

    const newAccessToken = this._authService.createNewAccessToken(user['_id']);

    return {
      accessToken: newAccessToken,
    };
  }
}
