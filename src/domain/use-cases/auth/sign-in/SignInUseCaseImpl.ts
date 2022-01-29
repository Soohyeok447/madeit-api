import { Injectable } from '@nestjs/common';
import { UserModel } from '../../../../domain/models/UserModel';
import { SignInResonse } from '../response.index';
import { SignInResponseDto } from './dtos/SignInResponseDto';
import { SignInUsecaseParams } from './dtos/SignInUsecaseParams';
import { SignInHelperFactory } from './sign-in-factory/SignInHelperFactory';
import { SignInUseCase } from './SignInUseCase';

@Injectable()
export class SignInUseCaseImpl implements SignInUseCase {
  constructor(
    private readonly _signInHelperFactory: SignInHelperFactory,
  ) { }

  public async execute({
    thirdPartyAccessToken,
    provider,
  }: SignInUsecaseParams): SignInResonse {
    const signInHelper = this._signInHelperFactory.makeHelper(provider, thirdPartyAccessToken);

    const userId: string = await signInHelper.verifyToken(thirdPartyAccessToken);

    const user: UserModel = await signInHelper.createOrFindUserByExistence(userId);

    const result = await signInHelper.issueToken(user);

    const token: SignInResponseDto = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    }

    return token;
  }
}