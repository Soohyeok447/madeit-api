import { Injectable } from '@nestjs/common';
import { UserModel } from '../../../models/UserModel';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { CommonUserService } from '../../user/service/CommonUserService';
import { ValidateResponse } from '../response.index';
import { OAuth, payload } from '../common/oauth-abstract-factory/OAuth';
import { OAuthFactory } from '../common/oauth-abstract-factory/OAuthFactory';
import { ValidateUseCaseParams } from './dtos/ValidateUseCaseParams';
import { ValidateUseCase } from './ValidateUseCase';

@Injectable()
export class ValidateUseCaseImpl implements ValidateUseCase {
  constructor(
    private readonly _oAuthFactory: OAuthFactory,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    thirdPartyAccessToken,
    provider,
  }: ValidateUseCaseParams): ValidateResponse {
    const oAuth: OAuth = this._oAuthFactory.createOAuth(
      thirdPartyAccessToken,
      provider,
    );

    const payload: payload = await oAuth.verifyToken();

    const userId: string = await oAuth.getUserIdByPayload(payload);

    const user: UserModel = await this._userRepository.findOneByUserId(userId);

    CommonUserService.assertUserExistence(user);

    return {};
  }
}
