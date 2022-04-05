import { UseCase } from '../../UseCase';
import { GetRoutinesResponse } from '../response.index';
import { GetRoutinesUsecaseParams } from './dtos/GetRoutinesUsecaseParams';

/**
 * 모든 루틴목록을 가져옴
 * cursor based pagination
 */
export abstract class GetRoutinesUseCase
  implements UseCase<GetRoutinesUsecaseParams, GetRoutinesResponse>
{
  public abstract execute(
    params: GetRoutinesUsecaseParams,
  ): GetRoutinesResponse;
}
