import { UseCase } from '../../UseCase';
import { WithdrawResponse } from '../response.index';
import { WithDrawUseCaseParams } from './dtos/WithDrawUseCaseParams';

/**
 * 간단 유저정보 저장
 */
export abstract class WithdrawUseCase
  implements UseCase<WithDrawUseCaseParams, WithdrawResponse>
{
  public abstract execute(params: WithDrawUseCaseParams): WithdrawResponse;
}
