import { Injectable } from '@nestjs/common';
import { HashProvider } from '../../../../domain/providers/HashProvider';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { ReissueAccessTokenResponse } from '../response.index';
import { CommonAuthService } from '../service/CommonAuthService';
import { ReissueAccessTokenUsecaseParams } from './dtos/ReissueAccessTokenUsecaseParams';
import { ReissueAccessTokenUseCase } from './ReissueAccessTokenUseCase';
import { CommonUserService } from '../../user/service/CommonUserService';

@Injectable()
export class ReissueAccessTokenUseCaseImpl
  implements ReissueAccessTokenUseCase
{
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _hashProvider: HashProvider,
    private readonly _authService: CommonAuthService,
  ) {}

  public async execute({
    refreshToken,
    id,
  }: ReissueAccessTokenUsecaseParams): ReissueAccessTokenResponse {
    const user = await this._userRepository.findOne(id);

    CommonUserService.assertUserExistence(user);

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
