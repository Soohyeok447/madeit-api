import { FindUserUsecaseDto } from './dtos/FindUserUsecaseDto';
import { UseCase } from '../../UseCase';
import { FindUserResponse } from '../response.index';

/**
 * id로 유저를 찾음
 */
export abstract class FindUserUseCase implements UseCase<FindUserUsecaseDto, FindUserResponse>{
  abstract execute({
    id,
    resolution,
  }: FindUserUsecaseDto): FindUserResponse
}
