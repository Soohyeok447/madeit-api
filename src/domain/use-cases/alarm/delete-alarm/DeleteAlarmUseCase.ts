import { UseCase } from '../../UseCase';
import { DeleteAlarmResponse } from '../response.index';
import { DeleteAlarmUsecaseParams } from './dtos/DeleteAlarmUsecaseParams';

/**
 * 알람 제거
 */
export abstract class DeleteAlarmUseCase
  implements UseCase<DeleteAlarmUsecaseParams, DeleteAlarmResponse>
{
  abstract execute(params: DeleteAlarmUsecaseParams): DeleteAlarmResponse;
}
