import { UseCase } from '../../UseCase';
import { GetRoutineResponse } from '../response.index';
import { GetRoutineUsecaseParams } from './dtos/GetRoutineUsecaseParams';

/**
 * 루틴 상세정보를 가져옴
 */
export abstract class GetRoutineUseCase
  implements UseCase<GetRoutineUsecaseParams, GetRoutineResponse>
{
  abstract execute(
    params: GetRoutineUsecaseParams,
  ): GetRoutineResponse;
}
