import { UseCase } from '../../UseCase';
import { SignInResponse } from '../response.index';
import { SignInUseCaseParams } from './dtos/SignInUseCaseParams';

/**
 * validate이후 response statusCode가 200이면
 * 회원가입 없이 토큰을 발급합니다
 */
export abstract class SignInUseCase
  implements UseCase<SignInUseCaseParams, SignInResponse>
{
  abstract execute({
    thirdPartyAccessToken,
    provider,
  }: SignInUseCaseParams): SignInResponse;
}
