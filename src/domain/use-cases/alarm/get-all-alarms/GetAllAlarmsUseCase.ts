import { UseCase } from '../../UseCase';
import { GetAllAlarmsResponse } from '../response.index';
import { GetAllAlarmsUsecaseParams } from './dtos/GetAllAlarmsUsecaseParams';

/**
 * 유저의 알람 리스트를 가져옴
 */
export abstract class GetAllAlarmsUseCase
  implements UseCase<GetAllAlarmsUsecaseParams, GetAllAlarmsResponse>
{
  abstract execute(params: GetAllAlarmsUsecaseParams): GetAllAlarmsResponse;
}
