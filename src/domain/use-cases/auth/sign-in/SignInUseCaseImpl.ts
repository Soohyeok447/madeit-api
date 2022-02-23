import { Injectable } from '@nestjs/common';
import { UserModel } from '../../../../domain/models/UserModel';
import { SignInResonse } from '../response.index';
import { SignInResponseDto } from './dtos/SignInResponseDto';
import { SignInUseCaseParams } from './dtos/SignInUseCaseParams';
import { payload, SignInDelegator } from './sign-in-factory/SignInDelegator';
import { SignInDelegatorFactory } from './sign-in-factory/SignInDelegatorFactory';
import { SignInUseCase } from './SignInUseCase';

@Injectable()
export class SignInUseCaseImpl implements SignInUseCase {
  constructor(private readonly _signInHelperFactory: SignInDelegatorFactory) {}

  public async execute({
    thirdPartyAccessToken,
    provider,
  }: SignInUseCaseParams): SignInResonse {
    const signInHelper: SignInDelegator = this._signInHelperFactory.makeHelper(
      provider,
      thirdPartyAccessToken,
    );

    const payload: payload = await signInHelper.verifyToken();

    const userId: string = await signInHelper.getUserIdByPayload(payload);

    const user: UserModel = await signInHelper.createOrFindUserByExistence(
      userId,
    );

    const result: SignInResponseDto = await signInHelper.issueToken(user);

    return result;
  }
}
