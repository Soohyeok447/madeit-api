import { UseCase } from '../../UseCase';
import { ValidateUsernameResponse } from '../../user/response.index';
import { WithDrawUseCaseParams } from './dtos/WithDrawUseCaseParams';

/**
 * 간단 유저정보 저장
 */
export abstract class WithdrawUseCase
  implements UseCase<WithDrawUseCaseParams, ValidateUsernameResponse>
{
  abstract execute(params: WithDrawUseCaseParams): ValidateUsernameResponse;
}
