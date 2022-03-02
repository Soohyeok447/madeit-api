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
  constructor(private readonly _signInDelegatorFactory: SignInDelegatorFactory) {}

  public async execute({
    thirdPartyAccessToken,
    provider,
  }: SignInUseCaseParams): SignInResonse {
    const signInDelegator: SignInDelegator = this._signInDelegatorFactory.makeHelper(
      provider,
      thirdPartyAccessToken,
    );

    const payload: payload = await signInDelegator.verifyToken();

    const userId: string = await signInDelegator.getUserIdByPayload(payload);

    const user: UserModel = await signInDelegator.createOrFindUserByExistence(
      userId,
    );

    const result: SignInResponseDto = await signInDelegator.issueToken(user);

    return result;
  }
}
