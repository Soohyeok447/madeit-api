import { UseCase } from '../../UseCase';
import { ValidateResponse } from '../response.index';
import { ValidateUseCaseParams } from './dtos/ValidateUseCaseParams';

//써드파티토큰으로 유저 가입여부 확인
//404 => signup (기존 onboard)
//200 => signin (issue token)
export abstract class ValidateUseCase
  implements UseCase<ValidateUseCaseParams, ValidateResponse>
{
  public abstract execute({
    thirdPartyAccessToken,
    provider,
  }: ValidateUseCaseParams): ValidateResponse;
}
