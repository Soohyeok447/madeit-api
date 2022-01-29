import { UseCase } from '../../UseCase';
import { GetAllRoutinesByCategoryResponse } from '../response.index';
import { GetAllRoutinesByCategoryUsecaseParams } from './dtos/GetAllRoutinesByCategoryUsecaseParams';

/**
 * 카테고리를 키값으로 모든 루틴목록을 가져옴
 * cursor based pagination
 */
export abstract class getAllRoutinesByCategoryUseCase
  implements
    UseCase<
      GetAllRoutinesByCategoryUsecaseParams,
      GetAllRoutinesByCategoryResponse
    >
{
  abstract execute(
    params: GetAllRoutinesByCategoryUsecaseParams,
  ): GetAllRoutinesByCategoryResponse;
}
