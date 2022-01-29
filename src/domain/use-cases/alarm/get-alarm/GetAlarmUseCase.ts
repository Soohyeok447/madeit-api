import { UseCase } from '../../UseCase';
import { GetAlarmResponse } from '../response.index';
import { GetAlarmUsecaseParams } from './dtos/GetAlarmUsecaseParams';

/**
 * 유저의 알람을 가져옴
 */
export abstract class GetAlarmUseCase
  implements UseCase<GetAlarmUsecaseParams, GetAlarmResponse>
{
  abstract execute(params: GetAlarmUsecaseParams): GetAlarmResponse;
}
