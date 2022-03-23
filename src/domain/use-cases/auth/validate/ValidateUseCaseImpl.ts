import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ValidateResponse } from '../response.index';
import { OAuthProviderFactory } from '../../../providers/OAuthProviderFactory';
import { ValidateUseCaseParams } from './dtos/ValidateUseCaseParams';
import { ValidateUseCase } from './ValidateUseCase';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { User } from '../../../entities/User';

@Injectable()
export class ValidateUseCaseImpl implements ValidateUseCase {
  constructor(
    private readonly _oAuthProviderFactory: OAuthProviderFactory,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    thirdPartyAccessToken,
    provider,
  }: ValidateUseCaseParams): ValidateResponse {
    const oAuthProvider = this._oAuthProviderFactory.create(provider);

    const payload = await oAuthProvider.verifyToken(thirdPartyAccessToken);

    const userId: string = await oAuthProvider.getUserIdByPayload(payload);

    const user: User = await this._userRepository.findOneByUserId(userId);

    if (!user) throw new UserNotFoundException();

    return {};
  }
}
