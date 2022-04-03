import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ValidateResponse } from '../response.index';
import { OAuthProviderFactory } from '../../../providers/OAuthProviderFactory';
import { ValidateUseCaseParams } from './dtos/ValidateUseCaseParams';
import { ValidateUseCase } from './ValidateUseCase';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';
import { OAuthProvider, payload } from '../../../providers/OAuthProvider';

@Injectable()
export class ValidateUseCaseImpl implements ValidateUseCase {
  public constructor(
    private readonly _oAuthProviderFactory: OAuthProviderFactory,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    thirdPartyAccessToken,
    provider,
  }: ValidateUseCaseParams): ValidateResponse {
    const oAuthProvider: OAuthProvider =
      this._oAuthProviderFactory.create(provider);

    const payload: payload = await oAuthProvider.getPayloadByToken(
      thirdPartyAccessToken,
    );

    const userId: string = await oAuthProvider.getUserIdByPayload(payload);

    const user: User = await this._userRepository.findOneByUserId(userId);

    if (!user) throw new UserNotFoundException();

    return {};
  }
}
