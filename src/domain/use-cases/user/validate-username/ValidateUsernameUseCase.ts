import { UseCase } from '../../UseCase';
import { ValidateUsernameResponse } from '../response.index';
import { ValidateUsernameUseCaseParams } from './dtos/ValidateUsernameUseCaseParams';

/**
 * 간단 유저정보 저장
 */
export abstract class ValidateUsernameUseCase
  implements UseCase<ValidateUsernameUseCaseParams, ValidateUsernameResponse>
{
  public abstract execute(
    params: ValidateUsernameUseCaseParams,
  ): ValidateUsernameResponse;
}
