import { UseCase } from '../../UseCase';
import { UpdateAlarmResponse } from '../response.index';
import { UpdateAlarmUsecaseParams } from './dtos/UpdateAlarmUsecaseParams';

/**
 * 알람 수정
 */
export abstract class UpdateAlarmUseCase
  implements UseCase<UpdateAlarmUsecaseParams, UpdateAlarmResponse>
{
  abstract execute(params: UpdateAlarmUsecaseParams): UpdateAlarmResponse;
}
