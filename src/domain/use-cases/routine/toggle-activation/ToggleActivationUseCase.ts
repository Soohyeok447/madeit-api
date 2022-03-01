import { UseCase } from '../../UseCase';
import { ToggleActivationResponse } from '../response.index';
import { ToggleActivationUsecaseParams } from './dtos/ToggleActivationUseCaseParams';

/**
 * 루틴 수정
 * admin Role필요
 */
export abstract class ToggleActivationUseCase
  implements UseCase<ToggleActivationUsecaseParams, ToggleActivationResponse>
{
  abstract execute(
    params: ToggleActivationUsecaseParams,
  ): ToggleActivationResponse;
}
