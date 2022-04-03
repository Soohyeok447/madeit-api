import { UseCase } from '../../UseCase';
import { ModifyUserResponse } from '../response.index';
import { ModifyUserUsecaseParams } from './dtos/ModifyUserUsecaseParams';

/**
 * 유저 정보 수정
 *
 *  */
export abstract class ModifyUserUseCase
  implements UseCase<ModifyUserUsecaseParams, ModifyUserResponse>
{
  public abstract execute(params: ModifyUserUsecaseParams): ModifyUserResponse;
}
