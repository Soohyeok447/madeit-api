import { UseCase } from '../../UseCase';
import { AddAlarmResponse } from '../response.index';
import { AddAlarmUsecaseParams } from './dtos/AddAlarmUsecaseParams';

/**
 * 알람 추가
 */
export abstract class AddAlarmUseCase
  implements UseCase<AddAlarmUsecaseParams, AddAlarmResponse>
{
  abstract execute(params: AddAlarmUsecaseParams): AddAlarmResponse;
}
