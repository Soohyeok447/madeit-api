import { UseCase } from '../../UseCase';
import { AddRoutineResponse } from '../response.index';
import { AddRoutineUsecaseParams } from './dtos/AddRoutineUsecaseParams';

/**
 * 루틴 추가
 * admin Role필요
 */
export abstract class AddRoutineUseCase
  implements UseCase<AddRoutineUsecaseParams, AddRoutineResponse>
{
  abstract execute(params: AddRoutineUsecaseParams): AddRoutineResponse;
}
