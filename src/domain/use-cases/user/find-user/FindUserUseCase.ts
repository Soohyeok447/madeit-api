import { FindUserUsecaseParams } from './dtos/FindUserUsecaseParams';
import { UseCase } from '../../UseCase';
import { FindUserResponse } from '../response.index';

/**
 * id로 유저를 찾음
 */
export abstract class FindUserUseCase
  implements UseCase<FindUserUsecaseParams, FindUserResponse>
{
  public abstract execute({ id }: FindUserUsecaseParams): FindUserResponse;
}
