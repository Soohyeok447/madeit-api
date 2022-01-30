import { Injectable } from '@nestjs/common';
import { UserModel } from '../../../../domain/models/UserModel';
import { SignInResonse } from '../response.index';
import { SignInResponseDto } from './dtos/SignInResponseDto';
import { SignInUsecaseParams } from './dtos/SignInUsecaseParams';
import { payload, SignInHelper } from './sign-in-factory/SignInHelper';
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
    const signInHelper: SignInHelper = this._signInHelperFactory.makeHelper(provider, thirdPartyAccessToken);

    const payload: payload = await signInHelper.verifyToken();
    
    const userId: string = await signInHelper.getUserIdByPayload(payload);

    const user: UserModel = await signInHelper.createOrFindUserByExistence(userId);

    const result: SignInResponseDto = await signInHelper.issueToken(user);

    return result;
  }
}